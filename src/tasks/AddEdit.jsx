import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { taskActions, alertActions } from '_store';

export { AddEdit };

function AddEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const task = useSelector(x => x.tasks?.item);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        dueDate: Yup.date().required("Due Date can not be empty"),
        status: Yup.string().required("Please select status")
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (id) {
            setTitle('Edit Task');
            // fetch user details into redux state and 
            // populate form fields with reset()
            dispatch(taskActions.getById(id)).unwrap()
                .then(task => {
                    const {title, description, status, due_date} = task[0];

                    reset({title, description, status, dueDate: due_date})
                });
        } else {
            setTitle('Add Task');
        }
    }, []);

    function formateDate (day){
        const date = new Date(day);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return dd + '-' + mm + '-' + yyyy;
    }

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            // create or update user based on id param
            data.dueDate = formateDate(data.dueDate);
            let message;
            if (id) {
                await dispatch(taskActions.update({ id, data })).unwrap();
                message = 'Task updated';
            } else {
                await dispatch(taskActions.createTask({data})).unwrap();
                message = 'Task added';
            }

            // redirect to user list with success message
            history.navigate('/tasks');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <>
            <h1>{title}</h1>
            {!(task?.loading || task?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Title</label>
                            <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Description</label>
                            <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Due Date</label>
                            <input name="dueDate" type="text" {...register('dueDate')} className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.dueDate?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">
                                Status
                                {id && <em className="ml-1">(Leave blank to keep the same password)</em>}
                            </label>
                            <select  name="status" {...register('status')} className={`form-control ${errors.status ? 'is-invalid' : ''}`} >
                                <option value="0">Not Started</option>
                                <option value="1">In Progress</option>
                                <option value="2">Completed</option>
                            </select>
                            
                            <div className="invalid-feedback">{errors.status?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/tasks" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {task?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {task?.error &&
                <div class="text-center m-5">
                    <div class="text-danger">Error loading Task: {task.error}</div>
                </div>
            }
        </>
    );
}