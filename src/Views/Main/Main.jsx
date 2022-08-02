import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../Components/Layout/Layout';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosPrivate } from '../../Lib/apiClient';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';

const Main = () => {
    const { auth } = useContext(AuthContext);
    let navigate = useNavigate();
    const [boards, setBoards] = useState([]);

    const handleDeleteBoard = async (boardId) => {
        try {
            await axiosPrivate.delete(`/board/delete/${boardId}`);
            const newBoards = boards.filter(board => board._id !== boardId);
            setBoards([...newBoards]);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCopyCode = (boardCode) => {
        navigator.clipboard.writeText(boardCode);
        alert("Board code successfully copied to clipboard");
    }

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await axiosPrivate.get(`/board/findAll/${auth.user._id}`);
                    const boards = response.data.results;
                    setBoards([...boards]);
                } catch (error) {
                    console.error(error);
                }
            }
        )();
    }, [auth.user._id, auth]);
    
    const formikBoardCode = useFormik({
        initialValues: boardCodeInitialValues,
        validationSchema: Yup.object(boardCodeValidationSchema),
        onSubmit: async (formValues) => {
            try {
            const code = formValues['code'];
            const response = await axiosPrivate.get(`/board/findOne/${code}`);
            if (response.data.results) {
                navigate(`/board/${code}`);
            } else {
                alert(`No board found with code: ${code}`)
            }
            } catch (error) {
            console.error(error);
            }
        }
    });

    const formikCreateBoard = useFormik({
        initialValues: createBoardInitialValues,
        validationSchema: Yup.object(createBoardValidationSchema),
        onSubmit: async (formValues) => {
            try {
            const response = await axiosPrivate.post(`/board/create`, {
                ...formValues
            });
            navigate(`/board/${response.data.result.code}`);
            } catch (error) {
                console.error(error);
            }
        }
    });

  return (
    <Layout>
        <section className='container pt-5'>
            <div className="row">
                <div className="col-md-6">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Enter a board code</h5>
                            <p className="card-text">Enter a code provided by your team to access a board</p>
                            <input
                                id='code'
                                type="text"
                                className="form-control"
                                style={{width: '50%', margin: 'auto', textAlign: 'center'}}
                                placeholder="#code"
                                aria-label="code"
                                aria-describedby="basic-addon1"
                                value={formikBoardCode.values.code}
                                onChange={(e) => formikBoardCode.setFieldValue('code', e.target.value)}
                            />
                            <button type='button' onClick={formikBoardCode.handleSubmit} className="btn btn-primary mt-3">Submit</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Create a board</h5>
                            <p className="card-text">Create a board and share it with your teammates</p>
                            <input
                                id='boardName'
                                type="text"
                                className="form-control"
                                style={{width: '50%', margin: 'auto', textAlign: 'center'}}
                                placeholder="Board Name"
                                aria-label="boardName"
                                aria-describedby="basic-addon1"
                                value={formikCreateBoard.values.boardName}
                                onChange={(e) => formikCreateBoard.setFieldValue('boardName', e.target.value)}
                            />
                            <button type='button' onClick={formikCreateBoard.handleSubmit} className="btn btn-primary mt-3">Create</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row p-5">
                <h3>Your boards</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#Code</th>
                            <th scope="col">Board Name</th>
                            <th scope="col">View</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            boards.map(({_id, userId, boardName, boardCode}) => {
                                return (
                                    <tr key={_id}>
                                        <th scope="row">
                                            <span 
                                                className='text-decoration-underline text-primary' 
                                                style={{cursor: 'grab'}} 
                                                onClick={() => handleCopyCode(boardCode)}
                                            >
                                                    {boardCode}
                                            </span>
                                        </th>
                                        <td>{boardName}</td>
                                        <td><button type='button' onClick={() => navigate(`/board/${boardCode}`)} className='btn btn-outline-success'><i className="bi bi-eye"></i></button></td>
                                        <td><button type='button' onClick={() => handleDeleteBoard(_id)} className='btn btn-outline-danger'><i className="bi bi-trash"></i></button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </section>
    </Layout>
  )
}

export default Main;

const boardCodeInitialValues = {
    code: '',
}
  const boardCodeValidationSchema = {
    code: Yup.string().min(6).required()
}

const createBoardInitialValues = {
    boardName: '',
}
  const createBoardValidationSchema = {
    boardName: Yup.string().required()
}