import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';
import qs from 'qs';

export const getProfile = createAsyncThunk('profile/getData', async (token) => {
  const result = {};
  try {
    const { data } = await http(token).get('/profile');
    console.log(data);
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const getAllProfile = createAsyncThunk('profile/getAllData', async (send) => {
  const result = {};
  try {
    const { data } = await http(send.token).get(`/allProfile?search=${send.search || ''}&limit=${send.limit || 5}&page=${send.page || 1}&sortBy=${send.sort || 'id'}`);
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    console.log('ini result getAllProfile kalo error', result);
    return result;
  }
});

export const getProfileById = createAsyncThunk('profileById/getData', async (request) => {
  const result = {};
  try {
    console.log('ini dari profile', request);
    const { data } = await http().get(`/admin/profile/${request}`);
    console.log('ini data', data);
    return data;
  } catch (e) {
    console.log('ini error dari profile');
    result.message = e.response.data?.message;
    return result;
  }
});

export const editProfile = createAsyncThunk('editProfileById/patchData', async (request) => {
  const result = {};
  try {
    console.log('ini dari profile', request);
    const send = qs.stringify(request.form);
    const { data } = await http(request.token).patch(`/profile/`, send, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    request.cb && request.cb();
    console.log('ini data', data);
    return data;
  } catch (e) {
    console.log('ini error dari profile');
    result.message = e.response.data?.message;
    return result;
  }
});

export const editPicture = createAsyncThunk('editProfileById/patchPicture', async (request) => {
  const result = {};
  try {
    var formData = new FormData();
    formData.append('picture', request.picture);
    console.log('ini dari profile', request.picture);
    const { data } = await http(request.token).patch(`/profile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('ini data', data);
    return data;
  } catch (e) {
    console.log('ini error dari profile');
    result.message = e.response.data?.message;
    return result;
  }
});

export const historyTransaction = createAsyncThunk('profile/getHistoryTransaction', async (request) => {
  const result = {};
  try {
    console.log('ini dari profile', request);
    const { data } = await http(request.token).get(`/historyTransaction?limit=${request.limit || 5}&page=${request.page || 1}`);
    console.log('ini data history', data);
    return data;
  } catch (e) {
    console.log('ini error dari profile');
    result.message = e.response.data?.message;
    return result;
  }
});
