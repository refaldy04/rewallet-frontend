import '../asset/css/personal-info.css';
import Navbar from '../component/Navbar';
import Dropdown from '../component/Dropdown';
import Footer from '../component/Footer';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/reducers/user';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { editProfile } from '../redux/asyncActions/profile';

export const PersonalInformation = () => {
  const [smShow, setSmShow] = useState(false);
  const [form, setForm] = useState({ fullname: '' });
  const handleClose = () => setSmShow(false);

  const handleChangeText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onEdit = (event) => {
    event.preventDefault();
    console.log(form);
    dispatch(editProfile({ form, token }));
  };

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.profile.data);
  const username = useSelector((state) => state.user.username);
  const email = useSelector((state) => state.user.email);

  const onLogout = () => {
    dispatch(logout());
  };
  return (
    <>
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
            <h4>Personal Information</h4>
            <p>We got your personal information from the sign up proccess. If you want to make changes on your information, contact our support.</p>
            <div>
              <div className="flex flex-column bg-light container">
                <h5 className="key">Username</h5>
                <h2 className="value">{username}</h2>
              </div>
              <div className="d-flex flex-column flex-lg-row justify-content-between bg-light container">
                <div>
                  <h5 className="key">Fullname</h5>
                  <h2 className="value">{profile.fullname || 'no had set fullname'}</h2>
                </div>
                <a onClick={() => setSmShow(true)} className="pointer">
                  Manage
                </a>
                <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm" centered>
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">Small Modal</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={onEdit}>
                    <Modal.Body className="d-flex flex-column align-items-center">
                      <Form.Group className="mb-3">
                        <Form.Control name="fullname" type="text" placeholder="type your fullname" className="text-secondary  text-center" onChange={handleChangeText} />
                        <Form.Control.Feedback type="invalid" className="text-center"></Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" onClick={handleClose}>
                        Submit
                      </Button>
                    </Modal.Body>
                  </Form>
                </Modal>
              </div>
              <div className="flex flex-column bg-light container">
                <h5 className="key">Verified E-mail</h5>
                <h2 className="value">{email}</h2>
              </div>
              <div className="d-flex flex-column flex-lg-row justify-content-between bg-light container">
                <div>
                  <h5 className="key">Phone Number</h5>
                  <h2 className="value">{profile.phone_number || 'no had set phone number'}</h2>
                </div>
                <Link to="/manage-phone-number">Manage</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PersonalInformation;
