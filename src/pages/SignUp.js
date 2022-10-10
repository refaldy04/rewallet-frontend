import React from 'react';
import Intro from '../component/Intro';
import '../asset/css/signup.css';
import FormInput from '../component/FormSignIn';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

export const SignUp = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, token]);

  return (
    <section className="row">
      <Intro />

      <div className="col-md-5 fw-form d-flex flex-column">
        <h3 className="fw-motto fw-margin">Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users</h3>
        <p className="fw-accessibility mt-4">Transfering money is eassier than ever, you can access Zwallet wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!</p>

        <FormInput />

        {/* <div class="d-grid fw-button mt-4 sign rounded">
            <Link to="/create-pin" class="btn text-light fs-bold" type="button">
              <span>Sign Up</span>
            </Link>
          </div> */}

        <p className="my-2 text-center fw-signup">
          Already have an account? Let's <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
