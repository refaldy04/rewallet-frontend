import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import React from 'react';
import { login } from '../redux/asyncActions/user';
import InputGroup from 'react-bootstrap/InputGroup';
import { IconContext } from 'react-icons';
import { FiLock, FiMail } from 'react-icons/fi';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('invalid email format').required('Required'),
  password: Yup.string().min(4).required('Required'),
});

const AuthForm = ({ errors, handleSubmit, handleChange, values }) => {
  const errorMsg = useSelector((state) => state.user.errorMsg);
  const succesMsg = useSelector((state) => state.user.successMsg);

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {succesMsg && <Alert variant="success">{succesMsg}</Alert>}

      <InputGroup className="mb-3" controlid="formBasicEmail">
        {/* <Form.Label>Email address</Form.Label> */}
        <InputGroup.Text id="basic-addon1">
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <div>
              <FiMail />
            </div>
          </IconContext.Provider>
        </InputGroup.Text>
        <Form.Control name="email" type="email" value={values.email} onChange={handleChange} placeholder="Enter email" isInvalid={!!errors.email} />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
      </InputGroup>

      <InputGroup className="mb-3" controlid="formBasicPassword">
        {/* <Form.Label>Password</Form.Label> */}
        <InputGroup.Text id="basic-addon1">
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <div>
              <FiLock />
            </div>
          </IconContext.Provider>
        </InputGroup.Text>
        <Form.Control name="password" type="password" value={values.password} onChange={handleChange} placeholder="Password" isInvalid={!!errors.password} />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </InputGroup>
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      {/* <HomeButton /> */}
      <p className="mt-4 text-end fw-forgot-pw">
        <Link to="/confirm-email">Forgot password?</Link>
      </p>
      <div className="d-grid">
        <Button variant="primary" type="submit" className="fw-login-btn text-light">
          Login
        </Button>
      </div>
    </Form>
  );
};

function FormInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = (value) => {
    const data = { email: value.email, password: value.password };
    console.log(data);
    dispatch(
      login({
        data,
        cb: () => {
          navigate('/dashboard', { replace: true });
        },
      })
    );
  };

  return (
    <Formik onSubmit={onLogin} initialValues={{ email: '', password: '' }} validationSchema={loginSchema}>
      {(props) => <AuthForm {...props} />}
    </Formik>
  );
}

export default FormInput;
