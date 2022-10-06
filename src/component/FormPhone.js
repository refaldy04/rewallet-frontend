import React from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import 'yup-phone';
import { useNavigate /*useLocation*/ } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { editProfile } from '../redux/asyncActions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { IconContext } from 'react-icons';
import { FiPhone } from 'react-icons/fi';

const phoneSchema = Yup.object().shape({
  phone_number: Yup.string().phone('IND', true, 'please use region indonesia phone number').required('requared'),
});

const AuthForm = ({ errors, handleSubmit, handleChange, values }) => {
  return (
    <Form className="mt-5 form-phone" noValidate onSubmit={handleSubmit}>
      <InputGroup className="mb-3" controlid="formBasicUsername">
        <InputGroup.Text id="basic-addon1">
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <div>
              <FiPhone />
            </div>
          </IconContext.Provider>
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
    dispatch(editProfile({ form, token, cb: () => navigate('/personal-information') }));
  };

  return (
    <Formik onSubmit={onEdit} initialValues={{ phone_number: '' }} validationSchema={phoneSchema}>
      {(props) => <AuthForm {...props} />}
    </Formik>
  );
}

export default FormPhone;
