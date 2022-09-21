import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Dropdown from '../component/Dropdown';
import Footer from '../component/Footer';
import '../asset/css/add-phone-number.css';
import { Link } from 'react-router-dom';
import FormPhone from '../component/FormPhone';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/user';
import { useNavigate } from 'react-router-dom';

export const AddPhoneNumber = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <div>
      <Navbar />
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list phone d-none d-lg-flex">
            <div className="d-flex flex-column gap-5">
              <Link to="/dashboard" className="d-flex gap-4 fw9-semibold">
                <i data-feather="grid" className="fw9-menu"></i>
                <h3 className="fw9-menu">Dashboard</h3>
              </Link>
              <Link to="/search-receiver" className="d-flex gap-4">
                <i data-feather="arrow-up" className="fw9-menu"></i>
                <h3 className="fw9-menu">Transfer</h3>
              </Link>
              <Link to="/top-up" href="top-up-page.html" className="d-flex gap-4">
                <i data-feather="arrow-down" className="fw9-menu"></i>
                <h3 className="fw9-menu">Top Up</h3>
              </Link>
              <Link to="/profile" className="d-flex gap-4">
                <i data-feather="user" className="fw9-menu-active"></i>
                <h3 className="fw9-menu-active fw-bold">Profile</h3>
              </Link>
            </div>
            <div>
              <Link to="/login" onClick={onLogout} className=" d-flex gap-4">
                <i data-feather="log-out" className="fw9-menu"></i>
                <h3 className="fw9-menu">Log Out</h3>
              </Link>
            </div>
          </div>

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-2 bg-light rounded-4 fw9-input-amount">
            <h4>Add Phone Number</h4>
            <p>Add at least one phone number for the transfer ID so you can start transfering your money to another user.</p>
            <div className="mx-auto d-flex justify-content-center align-items-center add-phone-btn">
              <FormPhone />

              {/* <div className="col-auto my-5">
                  <label className="visually-hidden" htmlFor="autoSizingInputGroup">
                    Email
                  </label>
                  <div className="input-group">
                    <span className="fw-bold">+62</span>
                    <input type="text" className="form-control" placeholder="Enter your phone number" />
                  </div>
                </div>
                <Link to="/personal-information" className="d-grid gap-2 my-5">
                  <button className="btn btn-primary" type="button">
                    Continue
                  </button>
                </Link> */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddPhoneNumber;
