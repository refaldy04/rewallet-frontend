import React, { useState } from "react";
import "../asset/css/reset-password-confirm-email.css";
import Intro from "../component/Intro";
import { IconContext } from "react-icons";
import { FiMail } from "react-icons/fi";
import { Button, Form, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkEmail } from "../redux/asyncActions/user";
import { useNavigate } from "react-router-dom";

export const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const errorMsg = useSelector((state) => state.user.errorMsg);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeText = (e) => {
    setEmail(e.target.value);
  };

  const onConfirm = (event) => {
    event.preventDefault();
    dispatch(
      checkEmail({
        email,
        cb: () => {
          navigate("/reset-password");
        },
      })
    );
  };
  return (
    <section className="row d-flex">
      <Intro />

      <div className="col-md-5 fw-form d-flex flex-column fw-confirmation gap-3">
        <h3 className="fw-question fw-bold">
          Did You Forgot Your Password? Don't Worry, You Can Reset Your Password
          In a Minutes.
        </h3>
        <p className="fw-guide">
          To reset your password, you must type your e-mail and we will send a
          link to your email and you will be directed to the reset password
          screens.
        </p>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={onConfirm}>
          <div>
            <label className="visually-hidden" htmlFor="autoSizingInputGroup">
              Email
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <IconContext.Provider value={{ size: "1.5rem" }}>
                  <div>
                    <FiMail />
                  </div>
                </IconContext.Provider>
              </div>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your e-mail"
                onChange={handleChangeText}
              />
            </div>
          </div>

          <div className="d-grid fw-button reset rounded mb-5 mt-4">
            <Button type="submit" className="btn text-light fw-bold">
              Confirm
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default ConfirmEmail;
