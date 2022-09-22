import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import character from './character';
import counter from './counter';
import auth from './user';
import profile from './profile';
import transfer from './transfer';

const authConfig = {
  storage,
  key: 'auth',
};

const profileConfig = {
  storage,
  key: 'profile',
};

const reducer = combineReducers({
  berhitung: counter,
  character,
  user: persistReducer(authConfig, auth),
  profile: persistReducer(profileConfig, profile),
  transfer,
});
// const reducer = combineReducers({
//   berhitung: counter,
//   character,
//   user: auth,
//   profile,
//   transfer,
// });

export default reducer;
