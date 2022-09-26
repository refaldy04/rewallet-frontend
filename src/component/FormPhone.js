import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate /*useLocation*/ } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { editProfile } from '../redux/asyncActions/profile';
import { useDispatch, useSelector } from 'react-redux';

const phoneSchema = Yup.object().shape({
  phone_number: Yup.string()
    .matches(/^[+0123456789]+$/, 'Number only')
    .required('Required'),
});

const AuthForm = ({ errors, handleSubmit, handleChange, values }) => {
  return (
    <Form className="mt-5 form-phone" noValidate onSubmit={handleSubmit}>
      {/* {location.state?.errMsg && (
          <div>
            <Alert variant="danger">{location.state.errMsg}</Alert>
          </div>
        )} */}
      <InputGroup className="mb-3" controlId="formBasicUsername">
        <InputGroup.Text id="basic-addon1">
          {/* <IconContext.Provider value={{ size: '1.5rem' }}> */}
          {/* <div><FiUser /></div> */}
          {/* </IconContext.Provider> */}
        </InputGroup.Text>
        <Form.Control name="phone_number" type="text" aria-describedby="basic-addon1" value={values.phone_number} onChange={handleChange} placeholder="Enter your new phone number" isInvalid={!!errors.phone_number} />
        <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
      </InputGroup>

      <div className="d-grid gap-2 my-5 ">
        <Button className="btn btn-primary" type="submit">
          Continue
        </Button>
      </div>
    </Form>
  );
};

export function FormPhone() {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onEdit = (value) => {
    const form = { phone_number: value.phone_number };
    dispatch(editProfile({ form, token }));
    navigate('/personal-information');
  };

  return (
    <Formik onSubmit={onEdit} initialValues={{ phone_number: '' }} validationSchema={phoneSchema}>
      {(props) => <AuthForm {...props} />}
    </Formik>
  );
}

export default FormPhone;
