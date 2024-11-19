import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { taskActions, projectActions } from '_store';

export { AddEdit };

function AddEdit() {
    const { projectId, id } = useParams();
    const [title, setTitle] = useState("Add Task");

    const dispatch = useDispatch();

    const formFields = useSelector(x => x.tasks.formFieldDetail);
    const { value: users } = useSelector(x => x.project.projectUsers);
    const task = useSelector(x => x.tasks?.item);
    const { isAdmin, userId } = useSelector(x => x.auth);
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        dueDate: Yup
        .string()
        .required('Due Date is required')
        .matches(/^(0?[1-9]|[12][0-9]|3[01])[-]((0?[1-9]|1[012])[-](19|20)?[0-9]{2})*$/,
            "Date must be in DD-MM-YYYY format")
        .test(
            "dates-test",
            "Due date can not be in past",
            (value, context) => {
                let startDate = new Date();
                let d = value.split("-");
                let endDate = new Date(d[2] + '/' + d[1] + '/' + d[0]);
                return endDate > startDate;
        }),        
        status: Yup.string()
        .test('len', 'Please select Status', val => val.length === 1),
        priority: Yup.string()
        .test('len', 'Please select Priority Level', val => val.length === 1),
        tagName: Yup.string()
        .test('len', 'Please select Tag Name', val => val.length === 1),
        assignedTo: Yup.string().when([], {
            is: () => isAdmin,
            then: Yup.string().test('len', 'Please select Assigned To', val => val.length <= 6),
            otherwise: Yup.string().notRequired(),
        }),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        dispatch(projectActions.getAllUsersByProject(projectId));
        dispatch(taskActions.getFormFieldDetail());
        if (id) {
            setTitle('Edit Task');
            // fetch user details into redux state and 
            // populate form fields with reset()
            dispatch(taskActions.getById(id)).unwrap()
                .then(task => {
                    const {userId, title, description, status, dueDate, priorityLevel, tag} = task[0];
                    reset({assignedTo: userId, title, description, status, dueDate, priority: priorityLevel, tagName: tag})
                });
        } else {
            setTitle('Add Task');
        }
    }, []);

    async function onSubmit(data) {
        if (id) {
            return dispatch(taskActions.update({ id, projectId, data, message: 'Task updated'  })).unwrap();
        } else {
            data.assignedTo = isAdmin ? data.assignedTo : userId;
            return dispatch(taskActions.createTask({projectId, data, message: 'Task Added' })).unwrap();
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
                            <input name="dueDate" disabled={!isAdmin && id !== undefined} type="text" {...register('dueDate')} className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.dueDate?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">
                                Status
                                {id && <em className="ml-1"></em>}
                            </label>
                            <select defaultValue={'DEFAULT'}  name="status" {...register('status')} className={`form-control ${errors.status ? 'is-invalid' : ''}`} >
                                <option value={'DEFAULT'} disabled>Select</option>
                                {
                                    formFields?.statuses?.map(e => <option key={`${e.id}_${e.status}`}  value={e.id}>{e.status}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors.status?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">
                                Priority
                                {id && <em className="ml-1"></em>}
                            </label>
                            <select defaultValue={'DEFAULT'} disabled={!isAdmin && id !== undefined} name="priority" {...register('priority')} className={`form-control ${errors.priority ? 'is-invalid' : ''}`} >
                                <option value={'DEFAULT'} disabled>Select</option>
                                {
                                    formFields?.priorityLevels?.map(e => <option key={`${e.id}_${e.priorityLevel}`}  value={e.id}>{e.priorityLevel}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors.priority?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">
                                Tag Name
                                {id && <em className="ml-1"></em>}
                            </label>
                            <select defaultValue={'DEFAULT'} disabled={!isAdmin && id !== undefined} name="tagName" {...register('tagName')} className={`form-control ${errors.tagName ? 'is-invalid' : ''}`} >
                                <option value={'DEFAULT'} disabled>Select</option>
                                {
                                    formFields?.tagName?.map(e => <option key={`${e.id}_${e.tagName}`}  value={e.id}>{e.tagName}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors.tagName?.message}</div>
                        </div>
                    </div>
                    {isAdmin && <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">
                                Assigned To
                                {id && <em className="ml-1"></em>}
                            </label>
                            <select defaultValue={'defaultValue'}  name="assignedTo" {...register('assignedTo')} className={`form-control ${errors.assignedTo ? 'is-invalid' : ''}`} >
                                <option value={'defaultValue'} disabled>Select</option>
                                {   
                                    (users || []).map(e => <option key={`${e.id}_${e.fullName}`}  value={e.id}>{e.fullName}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors.assignedTo?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            
                        </div>
                    </div>}
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <button className="btn btn-link" onClick={() => { history.navigate(`/project/${projectId}/tasks`)}} >Cancel</button>
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
