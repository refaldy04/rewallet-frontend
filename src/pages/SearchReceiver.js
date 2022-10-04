import React, { useState } from 'react';
import '../asset/css/search-receiver.css';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/reducers/user';
import { getAllProfile } from '../redux/asyncActions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/reducers/transfer';
import Navbar from '../component/Navbar';
import { IconContext } from 'react-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { FiSearch } from 'react-icons/fi';

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const profileData = useSelector((state) => state.profile.users);
  const data = {
    token,
  };
  const hallo = profileData?.map((user) => (
    <div
      onClick={() => {
        dispatch(selectUser({ id: user.id, picture: user.picture }));
        navigate('/input-amount');
      }}
      key={user.id}
      className="d-flex align-items- justify-content-between flex-column flex-xl-row"
    >
      <div className="d-flex align-items-start gap-2 user text-dark">
        <img src={user.picture ? `https://res.cloudinary.com/dwxrkcas3/image/upload/${user.picture}` : '/default-profile-pic.jpg'} alt="user" className="img-fluid profile-pic rounded" />
        <div className="d-flex flex-column justify-content-between">
          <h5 className="name-history">{user.fullname}</h5>
          <p className="type-history">{user.phone_number}</p>
        </div>
      </div>
    </div>
  ));

  React.useEffect(() => {
    dispatch(getAllProfile(data));
  }, []);
  return <>{hallo}</>;
};

export const SearchReceiver = () => {
  const [keyword, setKeyword] = useState({ search: '' });

  const token = useSelector((state) => state.user.token);
  const pageInfo = useSelector((state) => state.profile.usersPageInfo);

  const handleChangeText = (e) => {
    setKeyword({ ...keyword, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = {
    search: keyword.search,
    token,
  };

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
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

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-search-receiver">
            <p>Search Receiver</p>
            <Form
              className="mb-5"
              onSubmit={(event) => {
                event.preventDefault();
                dispatch(getAllProfile(data));
              }}
            >
              <InputGroup>
                <button type="submit" id="basic-addon2">
                  <IconContext.Provider value={{ size: '1.5rem' }}>
                    <div>
                      <FiSearch />
                    </div>
                  </IconContext.Provider>
                </button>
                <Form.Control type="text" name="search" className="fw9-input-search" placeholder="Search receiver here" aria-label="Username" aria-describedby="addon-wrapping" onChange={handleChangeText} />
              </InputGroup>
            </Form>

            <div className="d-flex flex-column gap-5 mt-4 mt-xl-0">
              <User />
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3">
              <button disabled={pageInfo.prevPage === null} onClick={() => dispatch(getAllProfile({ token, page: pageInfo.prevPage }))}>
                Prev
              </button>
              <div>1</div>
              <button disabled={pageInfo.nextPage === null} onClick={() => dispatch(getAllProfile({ token, page: pageInfo.currentPage + 1 }))}>
                Next
              </button>
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

export default SearchReceiver;
