import React, { useState } from "react";
import Navbar from "../component/Navbar";
import "../asset/css/profile-2.css";
// import Menu from '../component/Menu';
import Dropdown from "../component/Dropdown";
import User from "../asset/img/8bigger.png";
import Pencil from "../asset/img/edit-2.png";
import ArrowLeft from "../asset/img/arrow-left.png";
import Samuel from "../asset/img/David.png";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/user";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { editPicture } from "../redux/asyncActions/profile";
import Sidebar from "../component/Sidebar";
// import { Button } from 'bootstrap';

export const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const username = useSelector((state) => state.user.username);
  const profile = useSelector((state) => state.profile.data);
  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setSmShow(false);

  const token = useSelector((state) => state.user.token);

  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  const onEdit = (event) => {
    event.preventDefault();
    dispatch(editPicture({ picture: selectedImage, token }));
  };

  const handleChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };
  return (
    <>
      <Navbar />
      {/* <Button className="btn btn-success text-dark fw-bold" onClick={() => localStorage.setItem('auth', 'hello')}>
          Click me
        </Button> */}
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <Sidebar />

          <div className="col-lg-9 col-12 mt-5 mt-lg-0  d-flex flex-column gap-2">
            <div className="bg-light rounded-4 fw9-main d-flex flex-column gap-2 align-items-center">
              <img
                src={
                  profile.picture
                    ? `https://res.cloudinary.com/dwxrkcas3/image/upload/${profile.picture}`
                    : "/default-profile-pic.jpg"
                }
                alt="profile"
                className="img-fluid mx-auto profile-pic-user rounded"
              />
              <a
                className="d-flex mx-auto gap-1 align-items-start"
                onClick={() => setSmShow(true)}
              >
                <img
                  src={Pencil}
                  alt="edit"
                  className="img-fluid mx-auto mt-2"
                />
                <p className="text-secondary text-edit">Edit</p>
              </a>
              <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-sm">
                    Small Modal
                  </Modal.Title>
                </Modal.Header>
                <Form onSubmit={onEdit}>
                  <Modal.Body className="d-flex flex-column align-items-center">
                    <Form.Group className="mb-3">
                      <Form.Control
                        name="picture"
                        type="file"
                        className="text-secondary  text-center"
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-center"
                      ></Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" onClick={handleClose}>
                      Submit
                    </Button>
                  </Modal.Body>
                </Form>
              </Modal>
              <div className="mx-auto">
                <h3 className="text-center fw9-fullname">
                  {profile.fullname || username}
                </h3>
                <p className="text-center fw9-phone">{profile?.phone_number}</p>
              </div>
            </div>

            <div className="d-flex gap-2 flex-column flex-lg-row">
              <div className="d-flex flex-column col-lg-7 bg-light fw9-container-menu">
                <div className="d-flex flex-column align-items-center gap-3">
                  <Link
                    to="/personal-information"
                    className="fw9-profile-menu d-flex justify-content-between rounded-4 mx-auto"
                  >
                    <p>Personal Information</p>
                    <img src={ArrowLeft} alt="next" className="img-fluid" />
                  </Link>
                  <Link
                    to="/change-password"
                    className="fw9-profile-menu d-flex justify-content-between rounded-4 mx-auto"
                  >
                    <p>Change Password</p>
                    <img src={ArrowLeft} alt="next" className="img-fluid" />
                  </Link>
                  <Link
                    to="/change-pin"
                    className="fw9-profile-menu d-flex justify-content-between rounded-4 mx-auto"
                  >
                    <p>Change PIN</p>
                    <img src={ArrowLeft} alt="next" className="img-fluid" />
                  </Link>
                  <div className="fw9-profile-menu d-flex justify-content-between rounded-4 mx-auto">
                    <p>Logout</p>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column col-lg-5 bg-light fw9-contact-list">
                <div className="d-flex justify-content-between">
                  <p className="title">Contacts Info</p>
                  <a href="facebook.com">See all</a>
                </div>
                <div className="mt-4 d-flex flex-column gap-5">
                  <div className="d-flex justify-content-start align-items-start gap-2 fw9-user">
                    <img
                      src={Samuel}
                      alt="pict profile"
                      className="img-fluid"
                    />
                    <div>
                      <p className="name">Samuel Suhi</p>
                      <p className="phone">+62 8371-1010-2732</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-start align-items-start gap-2 fw9-user">
                    <img
                      src={Samuel}
                      alt="pict profile"
                      className="img-fluid"
                    />
                    <div>
                      <p className="name">Samuel Suhi</p>
                      <p className="phone">+62 8371-1010-2732</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-start align-items-start gap-2 fw9-user">
                    <img
                      src={Samuel}
                      alt="pict profile"
                      className="img-fluid"
                    />
                    <div>
                      <p className="name">Samuel Suhi</p>
                      <p className="phone">+62 8371-1010-2732</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
