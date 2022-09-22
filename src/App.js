import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

// import Example from './pages/Example';
import Count from './pages/Counter';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchReceiver from './pages/SearchReceiver';
import InputAmount from './pages/InputAmount';
import Confirmation from './pages/Confirmation';
import StatusSuccess from './pages/StatusSuccess';
import SignUp from './pages/SignUp';
import CreatePin from './pages/CreatePin';
import CreatePinSuccess from './pages/CreatePinSuccess';
import TopUp from './pages/TopUp';
import ConfirmEmail from './pages/ConfirmEmail';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import PersonalInformation from './pages/PersonalInformation';
import PrivateRoute from './component/PrivateRoute';
import ManagePhoneNumber from './pages/ManagePhoneNumber';
import AddPhoneNumber from './pages/AddPhoneNumber';
import ChangePassword from './pages/ChangePassword';
import ChangePin from './pages/ChangePin';
import StatusFailed from './pages/StatusFailed';

export class App extends Component {
  render() {
    return (
      <Routes>
        {/* <Route path="/" element={<Example />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="status-failed"
          element={
            <PrivateRoute>
              <StatusFailed />
            </PrivateRoute>
          }
        />
        <Route
          path="search-receiver"
          element={
            <PrivateRoute>
              <SearchReceiver />
            </PrivateRoute>
          }
        />
        <Route
          path="input-amount"
          element={
            <PrivateRoute>
              <InputAmount />
            </PrivateRoute>
          }
        />
        <Route
          path="confirmation"
          element={
            <PrivateRoute>
              <Confirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="status-success"
          element={
            <PrivateRoute>
              <StatusSuccess />
            </PrivateRoute>
          }
        />
        <Route path="counter" element={<Count />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route
          path="create-pin"
          element={
            <PrivateRoute>
              <CreatePin />
            </PrivateRoute>
          }
        />
        <Route path="create-pin-success" element={<CreatePinSuccess />} />
        <Route
          path="top-up"
          element={
            <PrivateRoute>
              <TopUp />
            </PrivateRoute>
          }
        />
        <Route path="confirm-email" element={<ConfirmEmail />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="personal-information"
          element={
            <PrivateRoute>
              <PersonalInformation />
            </PrivateRoute>
          }
        />
        <Route
          path="manage-phone-number"
          element={
            <PrivateRoute>
              <ManagePhoneNumber />
            </PrivateRoute>
          }
        />
        <Route
          path="add-phone-number"
          element={
            <PrivateRoute>
              <AddPhoneNumber />
            </PrivateRoute>
          }
        />
        <Route
          path="change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="change-pin"
          element={
            <PrivateRoute>
              <ChangePin />
            </PrivateRoute>
          }
        />
      </Routes>
    );
  }
}

export default App;
