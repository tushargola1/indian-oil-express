// src/components/ApiFunctions.js
import axios from 'axios';
import { apiBaseUrl } from '../Helper';
import { Encryption } from '../authentication/Encryption';

export const loginApi = (email, password) => {
  const rawBody = JSON.stringify({
    username: Encryption(email),
    password: Encryption(password),
  });

  return axios
    .post(apiBaseUrl("Auth/SapLogin"), rawBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log('✅ Login Response:', res.data);
      if (res.data.isSuccess) {
        return { success: true, data: res.data }; // Return success data
      } else {
        return { success: false, message: res.data.message }; // Return error message
      }
    })
    .catch((err) => {
      console.error('❌ Error:', err);
      return { success: false, message: err.response?.data?.message || 'Server error' }; // Return error message
    });
};
  