import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {inject, observer} from "mobx-react";

const Login = (props) => {
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.AuthStore.appState != null) {
            if (props.AuthStore.appState.isLoggedIn) {
                return props.history.push('/');
            }
        }
    });

    const handleSubmit = (values) => {
        axios.post(`/api/auth/login`, {...values})
            .then((res) => {
                console.log(res);
                if (res.data.success) {
                    const userData = {
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        access_token: res.data.access_token
                    };
                    const appState = {
                        isLoggedIn: true,
                        user: userData
                    };
                    props.AuthStore.saveToken(appState);
                    props.history.push('/');
                } else {
                    alert('You are not logged in');
                }
            })
            .catch(error => {
                if (error.response) {
                    let err = error.response.data;
                    setErrors(err.errors)
                } else if (error.request) {
                    let err = error.request;
                    setError(err);
                } else {
                    setError(error.message);
                }
            });
    }

    let arr = [];
    Object.values(errors).forEach(value => {
        arr.push(value)
    });
    return (
        <div style={{minWidth: 340, textAlign: 'center', height: '100vh'}}
             className="d-flex justify-content-center py-4 bg-body-tertiary">
            <form className="form-signin w-100 m-auto">
                <img className="mb-4" src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg" alt=""
                     width="72" height="57"/>
                <h1 className="h3 mb-3 fw-normal">Sign In Now</h1>
                {arr.length != 0 && arr.map((item) => (<p className="text-danger">{item}</p>))}
                {error != '' && (<p className="text-danger">{error}</p>)}
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            email: Yup.string().email('Email Format Incorrect').required('Email Required'),
                            password: Yup.string().required('Password Required')
                        })
                    }
                >
                    {({
                          values,
                          handleChange,
                          handleSubmit,
                          handleBlur,
                          errors,
                          isValid,
                          isSubmitting,
                          touched
                      }) => (
                        <div>
                            <div className="form-group">
                                <input type="email"
                                       className="form-control"
                                       placeholder="Email Address"
                                       value={values.email}
                                       onChange={handleChange('email')}
                                />
                                {(errors.email && touched.email) && <p>{errors.email}</p>}
                            </div>
                            <div className="form-group">
                                <input type="password"
                                       className="form-control"
                                       placeholder="password"
                                       value={values.password}
                                       onChange={handleChange('password')}
                                />
                                {(errors.password && touched.password) && <p>{errors.password}</p>}
                            </div>

                            <button
                                disabled={!isValid || isSubmitting}
                                onClick={handleSubmit}
                                className="btn btn-primary w-100 py-2"
                                type="button">
                                Login
                            </button>
                        </div>
                    )}
                </Formik>
                <Link className="mt-3 btn btn-lg btn-success btn-block" style={{display: 'block'}} to="/register">Create New Account</Link>
                <p className="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
            </form>
        </div>
    )
};

export default inject("AuthStore")(observer(Login));
