import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { alertActions } from '_store';
import { fetchWrapper, history } from '_helpers';

// create slice

const name = 'tasks';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const taskActions = { ...slice.actions, ...extraActions };
export const tasksReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: null,
        item: null,
        formFieldDetail: {},
        profile:{}
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api`;

    return {
        register: register(),
        getAll: getAll(),
        getById: getById(),
        update: update(),
        delete: _delete(),
        createTask : createTask(),
        getFormFieldDetail : getFormFieldDetail(),
        updateProfile: updateProfile(),
    };

    function updateProfile() {
        return createAsyncThunk(
            `${name}/updateProfile`,
            async (user) => await fetchWrapper.put(`${baseUrl}/updateProfile`, user)
        );
    }

    function register() {
        return createAsyncThunk(
            `${name}/register`,
            async (user) => await fetchWrapper.post(`${baseUrl}/register`, user)
        );
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async (projectId) => await fetchWrapper.get(`${baseUrl}/tasks/${projectId}/list`)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/tasks/getById/${id}`)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, projectId, data, message }, { dispatch }) {
            dispatch(alertActions.clear());
            try {
                data.projectId = projectId;
                await fetchWrapper.put(`${baseUrl}/tasks/edit/${id}`, data);
                history.navigate(`/project/${projectId}/tasks`);
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
                try{
                    await fetchWrapper.delete(`${baseUrl}/tasks/delete/${id}`);
                    dispatch(alertActions.success({ message: 'Task deleted', showAfterRedirect: true }));
                } catch (error){
                    dispatch(alertActions.error(error));
                }
            }
        );
    }

    function createTask() {
        return createAsyncThunk(
            `${name}/createTask`,
            async function ({ projectId, data, message }, { dispatch }) {
            dispatch(alertActions.clear());
            try {
                data.projectId = projectId;
                await fetchWrapper.post(`${baseUrl}/tasks/create`, data);
                history.navigate(`/project/${projectId}/tasks`);
                dispatch(alertActions.success({ message, showAfterRedirect: true }));
            } catch(error) {
                dispatch(alertActions.error(error));
            }
        });   
    }
    
    function getFormFieldDetail() {
        return createAsyncThunk(
            `${name}/getFormFieldDetail`,
            async () => await fetchWrapper.get(`${baseUrl}/tasks/getFormFields`)
        );    
    }  
}

function createExtraReducers() {
    return (builder) => {
        getAll();
        getById();
        _delete();
        getFormFieldDetail();
        updateProfile();

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

        function getFormFieldDetail() {
            var { pending, fulfilled, rejected } = extraActions.getFormFieldDetail;
            builder
                .addCase(pending, (state) => {
                    state.formFieldDetail = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.formFieldDetail =  action.payload ;
                })
                .addCase(rejected, (state, action) => {
                    state.formFieldDetail = { error: action.error };
                });
        }

        function updateProfile() {
            var { pending, fulfilled, rejected } = extraActions.updateProfile;
            builder
                .addCase(pending, (state) => {
                    state.profile = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.profile =  action.payload ;
                })
                .addCase(rejected, (state, action) => {
                    state.profile = { error: action.error };
                });
        }
    }
}
