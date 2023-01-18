import React, { Component } from 'react'
import '../asset/css/status-success.css'
import { Link } from 'react-router-dom'
import profile from '../asset/img/robert.png'
import check from '../asset/img/x.png'
import Sidebar from '../component/Sidebar'

export class StatusFailed extends Component {
  render() {
    return (
      <>
        <nav className="fw9-navbar">
          <div className="row d-flex justify-content-between container">
            <h1 className="fw9-brand col-lg-6 mb-5 mb-lg-0">ZWALLET</h1>
            <div className="d-flex gap-3 align-items-start col-lg-6 justify-content-lg-end">
              <img src={profile} className="img-fluid fw9-profile-pict" alt="profile" />
              <div className="d-flex flex-column justify-content-end">
                <h4 className="fw9-name-user d-flex">Robert Chandler</h4>
                <p>+62 8139 3877 7946</p>
              </div>
              <div className="d-flex fw9-bell">
                <i data-feather="bell"></i>
              </div>
            </div>
          </div>
        </nav>

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
            <Sidebar />

            <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
              <div className="rounded-circle d-flex justify-content-center align-items-center fw9-status mx-auto">
                <img src={check} alt="check" />
              </div>

              <p className="fw9-text-status mx-auto">Transfer Failed</p>

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
                <Link to="/confirmation" type="button" className="btn fw9-submit-btn fw-bold justify-content-center text-light d-flex align-items-center">
                  Try Again
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
    )
  }
}

export default StatusFailed
