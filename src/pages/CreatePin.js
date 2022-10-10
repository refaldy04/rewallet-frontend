import React, { useState } from 'react';
import '../asset/css/create-pin.css';
import Intro from '../component/Intro';
import { useDispatch, useSelector } from 'react-redux';
import { createPin } from '../redux/asyncActions/user';
import { useNavigate } from 'react-router-dom';

export const CreatePin = () => {
  const [form, setForm] = useState({ first: '', sec: '', third: '', fourth: '', fifth: '', sixth: '' });

  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pin = { pin: Object.values(form).join('') };
  const formPin = {
    pin: pin.pin,
    email,
  };

  const onCreatePin = () => {
    dispatch(createPin({ formPin, cb: () => navigate('/dashboard', { replace: true }) }));
  };

  return (
    <section className="row">
      <Intro />

      <div className="col-md-5 fw-form d-flex flex-column fw-create-pin">
        <h3 className="fw-motto fw-margin">Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users</h3>
        <p className="fw-accessibility mt-4">Transfering money is eassier than ever, you can access Zwallet wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!</p>

        {/* <div className="d-flex gap-2 input-pin">
          <input type="text" className="form-control my-2" name="first" maxLength="1" onChange={handleChangeText} />
          <input type="text" className="form-control my-2" name="sec" maxLength="1" onChange={handleChangeText} />
          <input type="text" className="form-control my-2" name="third" maxLength="1" onChange={handleChangeText} />
          <input type="text" className="form-control my-2" name="fourth" maxLength="1" onChange={handleChangeText} />
          <input type="text" className="form-control my-2" name="fifth" maxLength="1" onChange={handleChangeText} />
          <input type="text" className="form-control my-2" name="sixth" maxLength="1" onChange={handleChangeText} />
        </div> */}

        <div className="d-flex justify-content-center fw9-input my-5">
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="first" onChange={handleChangeText} />
          </div>
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="sec" onChange={handleChangeText} />
          </div>
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="third" onChange={handleChangeText} />
          </div>
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="fourth" onChange={handleChangeText} />
          </div>
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="fifth" onChange={handleChangeText} />
          </div>
          <div className="square">
            <input type="text" className="rounded-3 text-center fs-1" maxLength="1" name="sixth" onChange={handleChangeText} />
          </div>
        </div>

        <div className="d-grid fw-button create rounded">
          <button onClick={onCreatePin} className="btn text-light fw-bold" type="button">
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreatePin;
