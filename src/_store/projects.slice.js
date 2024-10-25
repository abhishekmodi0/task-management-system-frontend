import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from '_helpers';
import { alertActions } from '_store';

// create slice

const name = 'projects';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const projectActions = { ...slice.actions, ...extraActions };
export const projectReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: [],
        item: null, 
        users: [],
        projectUsers:[],
        dashboard: {}
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api`;

    return {
        getAll: getAll(),
        getById: getById(),
        update: update(),
        delete: _delete(),
        createProject : createProject(),
        getAllUsers: getAllUsers(),
        getAllUsersByProject: getAllUsersByProject(),
        getDashboard: getDashboard(),
    };

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}/${name}/getAllProjects`)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/${name}/getById/${id}`)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, data, message }, { dispatch }) {
            dispatch(alertActions.clear());
            try {
                await fetchWrapper.put(`${baseUrl}/${name}/edit/${id}`, data);
                history.navigate('/project');
                dispatch(alertActions.success({ message, showAfterRedirect: true }));
            } catch(error) {
                dispatch(alertActions.error(error));
            }
        });
    }

    // prefixed with underscore because delete is a reserved word in javascript
    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id, { getState, dispatch }) {
                await fetchWrapper.delete(`${baseUrl}/${name}/delete/${id}`);
            }
        );
    }

    function createProject() {
        return createAsyncThunk(
            `${name}/createProject`,
            async function ({ id, data, message }, { dispatch }) {
            dispatch(alertActions.clear());
            try {
                await fetchWrapper.post(`${baseUrl}/${name}/create`, data);
                history.navigate('/project');
                dispatch(alertActions.success({ message, showAfterRedirect: true }));
            } catch(error) {
                dispatch(alertActions.error(error));
            }
        });   
    }

    function getAllUsers() {
        return createAsyncThunk(
            `${name}/getAllUsers`,
            async () => await fetchWrapper.get(`${baseUrl}/${name}/users`)
        );
    }

    function getAllUsersByProject() {
        return createAsyncThunk(
            `${name}/getAllUsersByProject`,
            async (projectId) => await fetchWrapper.get(`${baseUrl}/${name}/users/${projectId}`)
        );
    }

    function getDashboard() {
        return createAsyncThunk(
            `${name}/getDashboard`,
            async () => await fetchWrapper.get(`${baseUrl}/getDashboardStats`)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getAll();
        getById();
        _delete();
        getAllUsers();
        getAllUsersByProject();
        getDashboard();


        function getAll() {
            var { pending, fulfilled, rejected } = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function getById() {
            var { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });
        }

        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const task = state.list.value.find(x => x.id === action.meta.arg);
                    task.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const task = state.list.value.find(x => x.id === action.meta.arg);
                    task.isDeleting = false;
                });
        }

        function getAllUsers() {
            var { pending, fulfilled, rejected } = extraActions.getAllUsers;
            builder
                .addCase(pending, (state) => {
                    state.users = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.users =  { value: action.payload };   
                })
                .addCase(rejected, (state, action) => {
                    state.users = { error: action.error };
                });
        }

        function getAllUsersByProject() {
            var { pending, fulfilled, rejected } = extraActions.getAllUsersByProject;
            builder
                .addCase(pending, (state) => {
                    state.users = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.projectUsers =  { value: action.payload };   
                })
                .addCase(rejected, (state, action) => {
                    state.users = { error: action.error };
                });
        }

        function getDashboard() {
            var { pending, fulfilled, rejected } = extraActions.getDashboard;
            builder
                .addCase(pending, (state) => {
                    state.dashboard = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.dashboard =   action.payload;   
                })
                .addCase(rejected, (state, action) => {
                    state.dashboard = { error: action.error };
                });
        }

    }
}
