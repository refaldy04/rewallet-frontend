import { createAsyncThunk } from '@reduxjs/toolkit'
import qs from 'qs'
import http from '../../helpers/http'

export const topup = createAsyncThunk('transaction/topup', async (request) => {
  const result = {}
  try {
    const send = qs.stringify(request.form)
    const { data } = await http(request.token).post('/topup', send, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
    request.cb()
    result.balance = data.result[0].balance
    return result
  } catch (e) {
    result.errorMsg = e.response.data.message
    return result
  }
})
