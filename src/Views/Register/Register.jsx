import React, { useContext } from 'react';
import Layout from '../../Components/Layout/Layout';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { publicAxios } from '../../Lib/apiClient';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';

const Register = () => {
const { setAuth } = useContext(AuthContext);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (formValues) => {
      try {
        const response = await publicAxios.post(`/auth/register`,
          {
            ...formValues
          }
        );
        setAuth({ ...response.data });
        localStorage.setItem("user", JSON.stringify({...response.data}));
        navigate('/');
      } catch (error) {
        if (error.response.data.msg === 'Bad request - Duplicate in collection') {
            alert('Failed to register user, try another username');
        } else {
            alert(error.response.data.msg);
        }
        console.error(error);
      }
    }
  });
  return (
    <Layout>
        <section style={{backgroundColor: '#eee', height: '100%'}}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{borderRadius: '25px'}}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                        <form className="mx-1 mx-md-4">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label" htmlFor="form3Example1c">Username</label>
                                                    <input 
                                                        id="username" 
                                                        type="text" 
                                                        className="form-control"
                                                        placeholder="Enter a your username"
                                                        value={formik.values.username}
                                                        onChange={(e) => formik.setFieldValue('username', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label" htmlFor="form3Example4c">Password</label>
                                                    <input 
                                                        id="password" 
                                                        type="password" 
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        value={formik.values.password}
                                                        onChange={(e) => formik.setFieldValue('password', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label" htmlFor="form3Example4cd">Repeat your password</label>
                                                    <input 
                                                        id="confirmPassword" 
                                                        type="password" 
                                                        className="form-control"
                                                        placeholder="Repeat password"
                                                        value={formik.values.confirmPassword}
                                                        onChange={(e) => formik.setFieldValue('confirmPassword', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button className="btn btn-outline-dark me-3" onClick={() => navigate('/login')}><i className="bi bi-arrow-left-circle"></i>Back</button>
                                                <button onClick={formik.handleSubmit} type="button" className="btn btn-primary btn-lg">Register</button>
                                            </div>

                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
  )
}

export default Register;

const initialValues = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  const validationSchema = {
    username: Yup.string().required(),
    password: Yup.string().min(6).required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null])
  }