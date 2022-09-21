import React from 'react';
import profileImg from '../asset/img/default-profile-pic.jpg';
import { useSelector } from 'react-redux';

export const Navbar = () => {
  const username = useSelector((state) => state.user.username);
  const profile = useSelector((state) => state.profile.data);
  const profilePic = `https://res.cloudinary.com/dwxrkcas3/image/upload/${profile.picture}`;

  return (
    <nav className="fw9-navbar">
      <div className="row d-flex justify-content-between navbar">
        <h1 className="fw9-brand col-lg-6 mb-5 mb-lg-0">RE-WALLET</h1>
        <div className="d-flex gap-3 align-items-start col-lg-6 justify-content-lg-end">
          <img src={profile.picture ? profilePic : profileImg} className="img-fluid fw9-profile-pict profile-pic rounded" alt="profile" />
          <div className="d-flex flex-column justify-content-end">
            <h4 className="fw9-name-user d-flex">{profile.fullname || username}</h4>
            <p>{profile?.phone_number}</p>
          </div>
          <div className="d-flex fw9-bell">
            <i data-feather="bell"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
