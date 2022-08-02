import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosPrivate } from '../../Lib/apiClient';

const NoteModal = ({show, setShow, colName, boardId, userId, type}) => {

  const handleClose = () => setShow(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (formValues) => {
        try {
          await axiosPrivate.post(`/note/create/${boardId}/user/${userId}`, {
              ...formValues,
              type
          });
          handleClose();
        } catch (error) {
            console.error(error);
        }
    }
  });

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{colName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="noteForm.noteTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                id='title'
                type="text"
                placeholder={`What to ${colName}?`}
                autoFocus
                value={formik.values.title}
                onChange={(e) => formik.setFieldValue('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="noteForm.noteDescription"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control 
                id='description' 
                as="textarea" 
                rows={3}
                value={formik.values.description}
                onChange={(e) => formik.setFieldValue('description', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default NoteModal;

const initialValues = {
  title: '',
  description: '',
}
const validationSchema = {
  title: Yup.string().required(),
  description: Yup.string().required(),
}
