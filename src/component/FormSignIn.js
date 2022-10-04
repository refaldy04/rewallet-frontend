import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/asyncActions/user';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import { IconContext } from 'react-icons';

import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required').min(4, 'username to short').max(8, 'usename to long'),
  email: Yup.string().email('invalid email format').required('Required'),
  password: Yup.string().min(8, 'password to short').required('Required'),
});

const AuthForm = ({ errors, handleSubmit, handleChange, values }) => {
  const navigate = useNavigate();
  const successMsg = useSelector((state) => state.user.successMsg);
  const errorMsg = useSelector((state) => state.user.errorMsg);

  React.useEffect(() => {
    if (successMsg) {
      navigate('/login', { state: { successMsg } });
    }
  }, [navigate, successMsg]);

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Form noValidate onSubmit={handleSubmit}>
        <InputGroup className="mb-3" controlid="formBasicUsername">
          <InputGroup.Text id="basic-addon1">
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <div>
                <FiUser />
              </div>
            </IconContext.Provider>
          </InputGroup.Text>
          <Form.Control name="username" type="text" aria-describedby="basic-addon1" value={values.username} onChange={handleChange} placeholder="Enter your username" isInvalid={!!errors.username} />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
        </InputGroup>

        <InputGroup className="mb-3" controlid="formBasicEmail">
          <InputGroup.Text id="basic-addon2">
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <div>
                <FiMail />
              </div>
            </IconContext.Provider>
          </InputGroup.Text>
          <Form.Control name="email" type="email" aria-describedby="basic-addon2" onChange={handleChange} placeholder="Enter your e-mail" isInvalid={!!errors.email} />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3" controlid="formBasicPassword">
          <InputGroup.Text id="basic-addon3">
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <div>
                <FiLock />
              </div>
            </IconContext.Provider>
          </InputGroup.Text>
          <Form.Control name="password" type="password" aria-describedby="basic-addon3" onChange={handleChange} placeholder="Create your password" isInvalid={!!errors.password} />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </InputGroup>

        <div className="d-grid">
          <Button variant="primary" type="submit" className="fw-login-btn text-light mt-4">
            Sign-Up
          </Button>
        </div>
      </Form>
    </>
  );
};

function FormInput() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const onRegister = (value) => {
    dispatch(register(value));
  };

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate, token]);
  return (
    <Formik initialValues={{ username: '', email: '', password: '' }} onSubmit={onRegister} validationSchema={loginSchema}>
      {(props) => <AuthForm {...props} />}
    </Formik>
  );
}

export default FormInput;
