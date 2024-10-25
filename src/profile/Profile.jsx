import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '_helpers';
import { taskActions, alertActions, authActions } from '../_store';

export { Profile };

function Profile() {
    const dispatch = useDispatch();
    const { value: user } = useSelector(x => x.auth);
    const [updatedUser] = useState(user);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        id: Yup.string().required(),
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        address: Yup.string()
            .required('Address is required'),
        email: Yup.string().email()
            .required('Email is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { reset, register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        const {address, firstName, lastName, id, email} = user[0].user;
        reset({address, firstName, lastName, id, email});
    }, [])

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            await dispatch(taskActions.updateProfile(data)).unwrap();
            let result = [{...updatedUser[0], user :{
                ...updatedUser[0].user,
                firstName: data.firstName,
                lastName : data.lastName,
                email : data.email,
                address:  data.address
            }}];
            dispatch(authActions.setAuth(result));
            localStorage.setItem('auth', JSON.stringify(result));
            dispatch(alertActions.success({ message: 'Profile Saved' }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <>
            <h1>Update Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col">
                        <label className="form-label">First Name</label>
                        <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="mb-3 col">
                        <label className="form-label">Last Name</label>
                        <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                        <label className="form-label">Address</label>
                        <input name="address" type="text" {...register('address')} className={`form-control ${errors.address ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.address?.message}</div>
                        </div>
                        <div className="mb-3 col">
                        <label className="form-label">Email</label>
                        <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                    </div>
                    
                    
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()}  type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <button className="btn btn-link" onClick={() => { history.navigate(`/project`)}} >Cancel</button>
                    </div>
                </form>
        </>
    )
}
