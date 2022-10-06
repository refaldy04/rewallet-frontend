import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/reducers/user';

export const Dropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <div className="dropdown d-lg-none d-block">
      <button className="fw9-btn-menu text-light btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Menu
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li>
          <Link className="dropdown-item active" to="/dashboard" aria-current="true">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/search-receiver">
            Transfer
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/top-up">
            Top Up
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/profile">
            Profile
          </Link>
        </li>
        <hr />
        <li>
          <button className="dropdown-item" onClick={onLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
