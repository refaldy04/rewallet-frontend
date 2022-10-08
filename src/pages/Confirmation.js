import React from 'react';
import '../asset/css/confirmation.css';
import Example from '../component/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/reducers/user';

export const Confirmation = () => {
  const recipient = useSelector((state) => state.transfer.dataRecipient);
  const dataTransfer = useSelector((state) => state.transfer.dataTransfer);
  const profile = useSelector((state) => state.profile.data);
  const dispatch = useDispatch();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  var d = new Date();

  const time = d.getHours() + '.' + d.getMinutes();

  React.useEffect(() => {
    console.log('ini data profile', dataTransfer.time);
  }, []);

  const onLogout = () => {
    dispatch(logout());
  };
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
          <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list d-none d-lg-flex">
            <div className="d-flex flex-column gap-5">
              <Link to="/dashboard" className="d-flex gap-4 fw9-semibold">
                <i data-feather="grid" className="fw9-menu"></i>
                <h3 className="fw9-menu">Dashboard</h3>
              </Link>
              <Link to="/search-receiver" className="d-flex gap-4">
                <i data-feather="arrow-up" className="fw9-menu-active fw-bold"></i>
                <h3 className="fw9-menu-active fw-bold">Transfer</h3>
              </Link>
              <Link to="/top-up" href="top-up-page.html" className="d-flex gap-4">
                <i data-feather="arrow-down" className="fw9-menu"></i>
                <h3 className="fw9-menu">Top Up</h3>
              </Link>
              <Link to="/profile" className="d-flex gap-4">
                <i data-feather="user" className="fw9-menu-active"></i>
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

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
            <p className="transfer-header">Transfer To</p>
            <div className="d-flex align-items-start justify-content-between flex-column flex-xl-row fw9-receiver">
              <div className="d-flex align-items-start gap-2">
                <img src={recipient.picture ? `https://res.cloudinary.com/dwxrkcas3/image/upload/${recipient.picture}` : '/default-profile-pic.jpg'} alt="user" className="img-fluid profile-pic rounded" />
                <div className="d-flex flex-column justify-content-between">
                  <h5 className="name-history">{recipient.fullname}</h5>
                  <p className="type-history">{recipient.phone_number}</p>
                </div>
              </div>
            </div>
            <p className="transfer-header">Details</p>

            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Amount</h5>
                <p className="type-history">{dataTransfer.amount}</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Balance Left</h5>
                <p className="type-history">Rp{profile.balance - dataTransfer.amount}</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Date And Time</h5>
                <p className="type-history">{today + time}</p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">Notes</h5>
                <p className="type-history">{dataTransfer.notes}</p>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Example />
            </div>

            {/* <div className="d-flex justify-content-end">
                <button type="button" className="btn fw9-submit-btn fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  Continue
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content fw9-modal">
                      <div className="modal-header">
                        <h5 className="modal-title fw-bold" id="exampleModalLabel">
                          Enter PIN to Transfer
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Enter your 6 digits PIN for confirmation to continue transferring money.</p>
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
                      </div>
                      <div className="modal-footer mt-5">
                        <Link to="/" type="button" className="btn fw9-submit-btn">
                          Continue
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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

export default Confirmation;
