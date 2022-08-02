import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import NoteModal from '../../Components/Modal/Modal';
import AuthContext from '../../context/AuthProvider';
import { axiosPrivate } from '../../Lib/apiClient';
import styles from './Board.module.css';

const Board = () => {
  const { auth } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [selectedCol, setSelectedCol] = useState({
    text: '',
    type: ''
  });
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(false);
  const [notesImp, setNotesImp] = useState([]);
  const [notesCon, setNotesCon] = useState([]);
  const [notesAct, setNotesAct] = useState([]);
  const navigate = useNavigate();
  const { code } = useParams();

  const handleShow = (colName, type) => {
    setSelectedCol({
        text: colName,
        type
    });
    setShow(true);
  }

  const handleDeleteNote = async (noteId, type) => {
    try {
        await axiosPrivate.delete(`/note/delete/${noteId}`);
        let notes = [];
        switch(type) {
            case 'continue':
                notes = notesCon.filter(note => note._id !== noteId);
                setNotesCon([...notes]);
                break;
            case 'improve':
                notes = notesImp.filter(note => note._id !== noteId);
                setNotesImp([...notes]);
                break;
            default:
                notes = notesAct.filter(note => note._id !== noteId);
                setNotesAct([...notes]);
        }
    } catch (error) {
        console.error(error);
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(board.boardCode);
    alert("Board code successfully copied to clipboard");
  }

  const fetchData = async () => {
    setLoading(true);
    try {
        const response = await axiosPrivate.get(`/board/findOne/${code}`);
        setBoard({...response.data.results});
        const noteRes = await axiosPrivate.get(`/note/findAll/${response.data.results._id}`);
        const notes = noteRes.data.results;
        const impNotes = notes.filter(note => note.type === 'improve');
        const conNotes = notes.filter(note => note.type === 'continue');
        const actNotes = notes.filter(note => note.type === 'actions');

        setNotesImp([...impNotes]);
        setNotesCon([...conNotes]);
        setNotesAct([...actNotes]);

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Layout>
        <div>
            <div className={`p-3 ${styles['page-header']}`}>
                <button onClick={() => navigate(-1)} className="btn btn-outline-dark"><i className="bi bi-arrow-left-circle"></i>Back</button>
                <h2>{board.boardName}</h2>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {
                        loading ? (
                            <div class="spinner-border text-success me-3" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <button className='btn btn-outline-success me-3' onClick={fetchData}><i class="bi bi-arrow-clockwise"></i></button>
                        )
                    }
                    <span onClick={handleCopyCode} style={{cursor: 'grab'}} className='fs-4'>Code: <strong>{board.boardCode}</strong> <i className="fs-5 bi bi-clipboard"></i></span>
                </div>
            </div>
            <section className={`p-3 ${styles['main-container']}`} style={{minHeight: '100%'}}>
                <div className={`shadow p-3 mb-5 rounded ${styles['board-col']}`}>
                    <div className={`text-center ${styles['row-header']}`}>
                        <h3>To continue</h3>
                        <button type='button' onClick={() => handleShow('To continue', 'continue')} className={`btn btn-success ${styles['add-btn']}`}>
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                    <div className="pt-4">
                        {
                            notesCon.map(({_id, title, description, userId}) => {
                                return (
                                    <div className="card text-bg-success mb-3" key={_id}>
                                        <div className="card-header">
                                            <h5 className="card-title">{title}</h5>
                                            {
                                                (board.userId === auth.user._id
                                                || userId === auth.user._id) && (
                                                    <button onClick={() => handleDeleteNote(_id, 'continue')} type='button' className={`btn btn-outline-dark ${styles['delete-btn']}`}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{description}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={`shadow p-3 mb-5 rounded ${styles['board-col']}`}>
                    <div className={`text-center ${styles['row-header']}`}>
                        <h3>To improve</h3>
                        <button type='button' onClick={() => handleShow('To improve', 'improve')} className={`btn btn-success ${styles['add-btn']}`}>
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                    <div className="pt-4">
                        {
                            notesImp.map(({_id, title, description, userId}) => {
                                return (
                                    <div className="card text-bg-warning mb-3" key={_id}>
                                        <div className="card-header">
                                            <h5 className="card-title">{title}</h5>
                                            {
                                                (board.userId === auth.user._id
                                                || userId === auth.user._id) && (
                                                    <button onClick={() => handleDeleteNote(_id, 'improve')} type='button' className={`btn btn-outline-dark ${styles['delete-btn']}`}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{description}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={`shadow p-3 mb-5 rounded ${styles['board-col']}`}>
                    <div className={`text-center ${styles['row-header']}`}>
                        <h3>Action points</h3>
                        <button type='button' onClick={() => handleShow('Action points', 'actions')} className={`btn btn-success ${styles['add-btn']}`}>
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                    <div className="pt-4">
                        {
                            notesAct.map(({_id, title, description, userId}) => {
                                return (
                                    <div className="card text-bg-secondary mb-3" key={_id}>
                                        <div className="card-header">
                                            <h5 className="card-title">{title}</h5>
                                            {
                                                (board.userId === auth.user._id
                                                || userId === auth.user._id) && (
                                                    <button onClick={() => handleDeleteNote(_id, 'actions')} type='button' className={`btn btn-outline-dark ${styles['delete-btn']}`}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{description}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </section>
        </div>
        <NoteModal show={show} setShow={setShow} colName={selectedCol.text} type={selectedCol.type} boardId={board._id} userId={auth.user._id} />
    </Layout>
  )
}

export default Board;