import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';
import qs from 'qs';

export const getUsers = createAsyncThunk('users/getData', async (token) => {
  const result = {};
  try {
    const { data } = await http(token).get('/allProfile');
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const transfer = createAsyncThunk('sendMoney/transfer', async (request) => {
  const result = {};
  try {
    const send = qs.stringify(request.data);
    const { data } = await http(request.token).post('/transfer', send, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    return data.result;
  } catch (e) {
    result.errorMsg = e.response.data.message;
    return result;
  }
});
