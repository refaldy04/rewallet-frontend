import React from 'react';
import '../asset/css/manage-phone-number.css';
import Navbar from '../component/Navbar';
import Dropdown from '../component/Dropdown';
import Footer from '../component/Footer';
import { FiTrash } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/reducers/user';

export const ManagePhoneNumber = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.data);

  const onLogout = () => {
    dispatch(logout());
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

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
            <h4>Manage Phone Number</h4>
            <p>You can only delete the phone number and then you must add another phone number.</p>
            <div className="d-flex justify-content-between align-items-center container">
              <div>
                <h5>Primary</h5>
                <h3 className="this-is-my-phone">{profile.phone_number}</h3>
              </div>
              <Link to="/add-phone-number">
                <IconContext.Provider value={{ size: '2em' }}>
                  <div>
                    <FiTrash />
                  </div>
                </IconContext.Provider>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManagePhoneNumber;
