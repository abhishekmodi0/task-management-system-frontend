import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { projectActions } from '_store';

export { AddEdit };

function AddEdit() {
    const {id} = useParams();
    const [title, setTitle] = useState();
    const [projectUsers, setProjectUsers] = useState([]);
    const dispatch = useDispatch();
    const project = useSelector(x => x.project?.item);
    const { value: users } = useSelector(x => x.project.users);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),

        completionDate: Yup
        .string()
        .required('Completion date is required')
        .matches(/^(0?[1-9]|[12][0-9]|3[01])[-]((0?[1-9]|1[012])[-](19|20)?[0-9]{2})*$/,
            "Date must be in DD-MM-YYYY format")
        .test(
            "dates-test",
            "Completion date can not be in past",
            (value, context) => {
                let startDate = new Date();
                let d = value.split("-");
                let endDate = new Date(d[2] + '/' + d[1] + '/' + d[0]);
                return endDate > startDate;
            }),
            assignedTo:  Yup.array()
            .min(1, "Please select at-least one member")
            .required("Please select at-least one member"),
        });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        dispatch(projectActions.getAllUsers());
        if (id) {
            setTitle('Edit Project');
            // fetch user details into redux state and 
            // populate form fields with reset()
            dispatch(projectActions.getById(id)).unwrap()
                .then(project => {
                    const {title, description, completionDate, users} = project[0];
                    reset({title, description, completionDate, assignedTo: users});
                    setProjectUsers(users);
                });
        } else {
            setTitle('Add Project');
        }
    }, []);

    async function onSubmit(data) {
        if (id) {
            if(JSON.stringify(data.assignedTo) == JSON.stringify(projectUsers)){
                data.recordsToBeDeleted = [];
                data.newRecordsAdded = false;
            } else {
                data.recordsToBeDeleted = projectUsers.filter(x => !data.assignedTo.includes(x));
                data.newRecordsAdded = data.assignedTo.filter(y => !projectUsers.includes(y)).length > 0;
            }
            return dispatch(projectActions.update({ id, data, message: 'Project updated' })).unwrap();
        } else {
            return dispatch(projectActions.createProject({data, message: 'Project added'})).unwrap();
        }
    }

    return (
        <>
            <h1>{title}</h1>
            {!(project?.loading || project?.error) &&
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
                            <label className="form-label">
                                Assign To
                                {id && <em className="ml-1"></em>}
                            </label>
                            <select multiple  name="assignedTo" {...register('assignedTo')} className={`form-control ${errors.assignedTo ? 'is-invalid' : ''}`} >
                                {   
                                    (users || []).map(e => <option key={`${e.id}_${e.fullName}`}  value={e.id}>{e.fullName}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors.assignedTo?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Completion Date</label>
                            <input name="completionDate" type="text" {...register('completionDate')} className={`form-control ${errors.completionDate ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.completionDate?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/project" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {project?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {project?.error &&
                <div class="text-center m-5">
                    <div class="text-danger">Error loading Project: {project.error}</div>
                </div>
            }
        </>
    );
}
