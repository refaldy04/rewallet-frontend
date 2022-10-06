import React from 'react';
import '../asset/css/change-pin.css';
import Navbar from '../component/Navbar';
import Dropdown from '../component/Dropdown';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';
import { logout } from '../redux/reducers/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const ChangePin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  React.useEffect(() => {
    window.alert('in development');
  }, []);
  return (
    <div>
      <Navbar />
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list d-none d-lg-flex">
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
            <h4>Change PIN</h4>
            <p>Enter your current 6 digits Zwallet PIN below to continue to the next steps.</p>
            <div className="mx-auto">
              <div className="d-flex justify-content-center gap-3 fw9-input my-5">
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
              </div>
              <Link to="/profile" className="d-grid gap-2">
                <button className="btn btn-primary" type="button">
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChangePin;
