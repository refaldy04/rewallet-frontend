import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';
import qs from 'qs';

export const getProfile = createAsyncThunk('profile/getData', async (token) => {
  const result = {};
  try {
    const { data } = await http(token).get('/profile');
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const getAllProfile = createAsyncThunk('profile/getAllData', async (send) => {
  const result = {};
  try {
    const { data } = await http(send.token).get(`/allProfile?search=${send.search || ''}&limit=${send.limit || 5}&page=${send.page || 1}&sort=${send.sort || 0}`);
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const getProfileById = createAsyncThunk('profileById/getData', async (request) => {
  const result = {};
  try {
    const { data } = await http().get(`/admin/profile/${request}`);
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const editProfile = createAsyncThunk('editProfileById/patchData', async (request) => {
  const result = {};
  try {
    const send = qs.stringify(request.form);
    const { data } = await http(request.token).patch(`/profile/`, send, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    request.cb && request.cb();
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const editPicture = createAsyncThunk('editProfileById/patchPicture', async (request) => {
  const result = {};
  try {
    var formData = new FormData();
    formData.append('picture', request.picture);
    const { data } = await http(request.token).patch(`/profile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});

export const historyTransaction = createAsyncThunk('profile/getHistoryTransaction', async (request) => {
  const result = {};
  try {
    const { data } = await http(request.token).get(`/historyTransaction?limit=${request.limit || 5}&page=${request.page || 1}`); //historyTransaction//
    return data;
  } catch (e) {
    result.message = e.response.data?.message;
    return result;
  }
});
