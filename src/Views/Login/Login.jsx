import React, { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';

import Layout from '../../Components/Layout/Layout';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { publicAxios } from '../../Lib/apiClient';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (formValues) => {
      try {
        const response = await publicAxios.post(`/auth/login`,
          {
            ...formValues
          }
        );
        setAuth({ ...response.data });
        localStorage.setItem("user", JSON.stringify({...response.data}));
        navigate('/');
      } catch (error) {
        if (error.response.data.message === 'Unauthorized') {
          alert('Incorrect username or password');
      } else {
          alert(error.response.data.message);
      }
        console.error(error);
      }
    }
  });

  return (
    <Layout>
      <section style={{height: '100%'}}>
        <div className="container-fluid h-custom" style={{height: '100%'}}>
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <h2 className='mb-4'>Login</h2>
                {/* <!-- Username input --> */}
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter a your username"
                    value={formik.values.username}
                    onChange={(e) => formik.setFieldValue('username', e.target.value)}
                  />
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={(e) => formik.setFieldValue('password', e.target.value)}
                  />
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="button" onClick={formik.handleSubmit} className="btn btn-primary btn-lg"
                    style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>Login</button>
                  <div className='container'>
                    <div className="row">
                      <p className="col small fw-bold mt-2 pt-1 mb-0">Don't have an account?</p>
                      <button type='button' onClick={() => navigate('/register')} className="col btn btn-outline-primary">Register</button>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Login;

const initialValues = {
  username: '',
  password: ''
}
const validationSchema = {
  username: Yup.string().required(),
  password: Yup.string().min(6).required()
}