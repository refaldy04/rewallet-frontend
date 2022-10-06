import React from 'react';
import '../asset/css/input-amount.css';
// import { Link } from 'react-router-dom';
import FormInputMoney from '../component/FormInputMoney';
// import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileById } from '../redux/asyncActions/profile';
import { Link } from 'react-router-dom';
import { logout } from '../redux/reducers/user';
import Navbar from '../component/Navbar';

export const InputAmount = () => {
  const recipient_id = useSelector((state) => state.transfer.dataTransfer);
  const recipient = useSelector((state) => state.transfer.dataRecipient);
  const dispatch = useDispatch();
  React.useEffect(() => {
    console.log('ini dari input amount', recipient);
    dispatch(getProfileById(recipient_id.recipient_id));
  }, []);

  const onLogout = () => {
    dispatch(logout());
  };
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
            <p className="transfer-header">Transfer Money</p>
            <div className="d-flex align-items-start justify-content-between flex-column flex-xl-row fw9-receiver">
              <div className="d-flex align-items-start gap-2">
                <img src={recipient.picture ? `https://res.cloudinary.com/dwxrkcas3/image/upload/${recipient.picture}` : '/default-profile-pic.jpg'} alt="" className="img-fluid profile-pic rounded" />
                <div className="d-flex flex-column justify-content-between">
                  <h5 className="name-history">{recipient.fullname}</h5>
                  <p className="type-history">{recipient.phone_number}</p>
                </div>
              </div>
            </div>
            <p className="guide-transfer">Type the amount you want to transfer and then press continue to the next steps.</p>
            <div className="d-flex flex-column align-items-center">
              <FormInputMoney />
              {/* <input type="text" className="text-secondary fw9-input-money text-center fs-1" placeholder="0.0" /> */}

              {/* <Button variant="primary" type="submit" className="btn btn-primary fw9-submit-btn">
                  Continue
                </Button> */}
            </div>
            <div className="d-flex justify-content-end"></div>
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

export default InputAmount;
