// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const auth = localStorage.getItem('auth');

//   return auth ? children : <Navigate to="/login"  replace={true} state={{ errMsg: 'You must login first' }} />;
// };

// export default PrivateRoute;

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);
  if (token) {
    return children;
  }
  return <Navigate to={'/login'} preventScrollReset={true} />;
};

export default PrivateRoute;
