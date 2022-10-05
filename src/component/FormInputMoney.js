import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { inputAmount } from '../redux/reducers/transfer';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

const amountSchema = Yup.object().shape({
  amount: Yup.number().min(10000, 'minimum Rp 10.000').max(5000000, 'maximum Rp 5.000.000').required('Required'),
});

const AuthForm = ({ errors, handleSubmit, handleChange, values }) => {
  const profile = useSelector((state) => state.profile.data);
  return (
    <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {/* <Form.Label>Email address</Form.Label> */}
        <Form.Control name="amount" type="text" value={values.amount} onChange={handleChange} placeholder="0.0" className="text-secondary fw9-input-money text-center fs-1" isInvalid={!!errors.amount} />
        <Form.Control.Feedback type="invalid" className="text-center">
          {errors.amount}
        </Form.Control.Feedback>
        {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
      </Form.Group>
      <p>Rp{profile.balance} Available</p>
      <div className="col-auto my-5">
        <label className="visually-hidden" htmlFor="autoSizingInputGroup">
          Email
        </label>
        <Form.Group className="mb-3" controlId="formBasicNotes">
          {/* <Form.Label>Email address</Form.Label> */}
          <Form.Control name="notes" type="text" value={values.notes} onChange={handleChange} placeholder="Add some notes" className="form-control text-center" />
          {/* <Form.Control.Feedback type="invalid" className="text-center">
            {errors.amount}
          </Form.Control.Feedback> */}
          {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
        </Form.Group>
        {/* <div className="input-group">
          <div className="input-group-text">
            <i data-feather="edit-2"></i>
          </div>
          <input type="text" name="notes" value={values.notes} onChange={handleChange} className="form-control text-center" placeholder="Add some notes" />
        </div> */}
      </div>

      <div>
        <Button variant="primary" type="submit" className="fw-login-btn text-light">
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default function FormInputMoney() {
  const navigate = useNavigate();
  const today = new Date();
  const dispatch = useDispatch();

  function handleClick(value) {
    const dataTransfer = {
      ...value,
      time: today,
    };
    console.log('ini value data transfer dari input amount', dataTransfer);
    dispatch(inputAmount(dataTransfer));
    navigate('/confirmation');
  }
  return (
    <Formik initialValues={{ amount: '', notes: '' }} onSubmit={handleClick} validationSchema={amountSchema}>
      {(props) => <AuthForm {...props} />}
    </Formik>
  );
}
