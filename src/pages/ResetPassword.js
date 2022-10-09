import React, { useState } from 'react';
import '../asset/css/reset-password.css';
import Intro from '../component/Intro';
import { IconContext } from 'react-icons';
import { FiLock } from 'react-icons/fi';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { resetPassword } from '../redux/asyncActions/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  newpass: yup.string().min(8, 'Too Short!').required('Required'),
  repetPass: yup.string().required('Required'),
});

export const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState(null);
  const id = useSelector((state) => state.user.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <section className="row d-flex">
      <Intro />

      <div className="col-md-5 fw-form d-flex flex-column fw-confirmation gap-3">
        <h3 className="fw-question fw-bold">Did You Forgot Your Password? Don't Worry, You Can Reset Your Password In a Minutes.</h3>
        <p className="fw-guide">To reset your password, you must type your e-mail and we will send a link to your email and you will be directed to the reset password screens.</p>
        <Formik
          initialValues={{
            newpass: '',
            repetPass: '',
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            // console.log(values);
            if (values.newpass !== values.repetPass) {
              setErrMsg('please repeat new password correctly');
            } else {
              setErrMsg(null);
              dispatch(
                resetPassword({
                  data: { newpassword: values.newpass },
                  id,
                  cb: () => {
                    navigate('/login');
                  },
                })
              );
            }
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <>
              {errMsg && (
                <Alert key="danger" variant="danger">
                  {errMsg}
                </Alert>
              )}
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <label className="visually-hidden" htmlFor="autoSizingInputGroup">
                    Password
                  </label>
                  <InputGroup hasValidation>
                    <div className="input-group-text">
                      <IconContext.Provider value={{ size: '1.5rem' }}>
                        <div>
                          <FiLock />
                        </div>
                      </IconContext.Provider>
                    </div>
                    <Form.Control name="newpass" type="password" placeholder="Create new password" value={values.newpass} onChange={handleChange} isInvalid={!!errors.newpass} />
                    <Form.Control.Feedback type="invalid">{errors.newpass}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mt-3">
                  <label className="visually-hidden" htmlFor="autoSizingInputGroup">
                    Password
                  </label>
                  <InputGroup hasValidation>
                    <div className="input-group-text">
                      <IconContext.Provider value={{ size: '1.5rem' }}>
                        <div>
                          <FiLock />
                        </div>
                      </IconContext.Provider>
                    </div>
                    <Form.Control name="repetPass" type="password" placeholder="Create new password" value={values.repetPass} onChange={handleChange} isInvalid={!!errors.repetPass} />
                    <Form.Control.Feedback type="invalid">{errors.repetPass}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid fw-button reset rounded mt-3">
                  <Button type="submit" className="text-light fw-bold">
                    Reset Password
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default ResetPassword;
