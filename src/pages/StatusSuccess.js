import React, { Component } from 'react';
import '../asset/css/status-success.css';
import { Link } from 'react-router-dom';

import profile from '../asset/img/robert.png';
import check from '../asset/img/check.png';

import { IconContext } from 'react-icons';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import Navbar from '../component/Navbar';
export const StatusSuccess = () => {
  return (
    <>
      <Navbar />

      <main>
        <div className="dropdown d-lg-none d-block">
          <button className="fw9-btn-menu text-light btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item active" href="facebook.com" aria-current="true">
                Dashboard
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="facebook.com">
                Transfer
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="facebook.com">
                Top Up
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="facebook.com">
                Profile
              </a>
            </li>
            <hr />
            <li>
              <a className="dropdown-item" href="facebook.com">
                Log Out
              </a>
            </li>
          </ul>
        </div>

        <div className="d-flex gap-3">
          <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list d-none d-lg-flex">
            <div className="d-flex flex-column gap-5">
              <a href="home-page.html" className="d-flex gap-4 fw9-semibold">
                <i data-feather="grid" className="fw9-menu"></i>
                <h3 className="fw9-menu">Dashboard</h3>
              </a>
              <a href="search-receiver-page.html" className="d-flex gap-4">
                <i data-feather="arrow-up" className="fw9-menu-active"></i>
                <h3 className="fw9-menu-active">Transfer</h3>
              </a>
              <a href="top-up-page.html" className="d-flex gap-4">
                <i data-feather="arrow-down" className="fw9-menu"></i>
                <h3 className="fw9-menu">Top Up</h3>
              </a>
              <a href="profile-1-page.html" className="d-flex gap-4">
                <i data-feather="user" className="fw9-menu"></i>
                <h3 className="fw9-menu">Profile</h3>
              </a>
            </div>
            <div>
              <div className="d-flex gap-4">
                <i data-feather="log-out" className="fw9-menu"></i>
                <h3 className="fw9-menu">Log Out</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
            <div className="rounded-circle d-flex justify-content-center align-items-center fw9-status mx-auto">
              <img src={check} alt="check" />
            </div>

            <p className="fw9-text-status mx-auto">Transfer Success</p>

            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Amount</h5>
                <p className="type-history">Rp100.000</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Balance Left</h5>
                <p className="type-history">Rp20.000</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Date And Time</h5>
                <p className="type-history">May 11, 2020 - 12.20</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Notes</h5>
                <p className="type-history">For buying some socks</p>
              </div>
            </div>

            <p className="transfer-header">Transfer To</p>
            <div className="d-flex align-items-start justify-content-between flex-column flex-xl-row fw9-receiver">
              <div className="d-flex align-items-start gap-2">
                <img src="asset/img/David.png" alt="" className="img-fluid" />
                <div className="d-flex flex-column justify-content-between">
                  <h5 className="name-history">Samuel Suhi</h5>
                  <p className="type-history">+62 813-8492-9994</p>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-xl-row justify-content-end gap-3 mt-5">
              <button type="button" className="btn fw9-submit-btn grey fw-bold text-light">
                <IconContext.Provider value={{ size: '2em', color: 'gray' }}>
                  <FiShare2 />
                </IconContext.Provider>
              </button>
              <button type="button" className="btn fw9-submit-btn grey justify-content-center fw-bold fw9-primary-clr d-flex align-items-center">
                {<FiDownload />} Download PDF
              </button>
              <Link to="/dashboard" type="button" className="btn fw9-submit-btn justify-content-center fw-bold text-light d-flex align-items-center">
                Continue
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="d-flex flex-column flex-lg-row justify-content-lg-between">
        <p>2020 Re-wallet. All right reserved.</p>
        <div className="d-flex gap-lg-5 flex-column flex-lg-row">
          <p>+62 5637 8882 9901</p>
          <p>contact@rewallet.com</p>
        </div>
      </footer>
    </>
  );
};

export default StatusSuccess;
