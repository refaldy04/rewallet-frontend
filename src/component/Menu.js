import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/user';
import { useNavigate } from 'react-router-dom';

export const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list d-none d-lg-flex">
      <div className="d-flex flex-column gap-5">
        <Link to="/dashboard" className="d-flex gap-4 fw9-semibold">
          <i data-feather="grid" className="fw9-menu-active"></i>
          <h3 className="fw9-menu-active">Dashboard</h3>
        </Link>
        <Link to="/search-receiver" className="d-flex gap-4">
          <i data-feather="arrow-up" className="fw9-menu"></i>
          <h3 className="fw9-menu">Transfer</h3>
        </Link>
        <Link to="/top-up" href="top-up-page.html" className="d-flex gap-4">
          <i data-feather="arrow-down" className="fw9-menu"></i>
          <h3 className="fw9-menu-active fw-bold">Top Up</h3>
        </Link>
        <Link to="/profile" className="d-flex gap-4">
          <i data-feather="user" className="fw9-menu"></i>
          <h3 className="fw9-menu">Profile</h3>
        </Link>
      </div>
      <div>
        <Link to="/login" onClick={onLogout} className=" d-flex gap-4">
          <i data-feather="log-out" className="fw9-menu"></i>
          <h3 className="fw9-menu">Log Out</h3>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
