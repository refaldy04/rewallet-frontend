import React, { Component } from 'react';
import '../asset/css/reset-password-confirm-email.css';
import Intro from '../component/Intro';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FiMail } from 'react-icons/fi';

export class ConfirmEmail extends Component {
  render() {
    return (
      <section className="row d-flex">
        <Intro />

        <div className="col-md-5 fw-form d-flex flex-column fw-confirmation gap-3">
          <h3 className="fw-question fw-bold">Did You Forgot Your Password? Don't Worry, You Can Reset Your Password In a Minutes.</h3>
          <p className="fw-guide">To reset your password, you must type your e-mail and we will send a link to your email and you will be directed to the reset password screens.</p>
          <div>
            <label className="visually-hidden" htmlFor="autoSizingInputGroup">
              Email
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <div>
                    <FiMail />
                  </div>
                </IconContext.Provider>
              </div>
              <input type="email" className="form-control" placeholder="Enter your e-mail" />
            </div>
          </div>

          <div className="d-grid fw-button reset rounded mb-5">
            <Link to="/reset-password" className="btn text-light fw-bold" type="button">
              Confirm
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default ConfirmEmail;
