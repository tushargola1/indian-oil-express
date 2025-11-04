import axios from 'axios';
import { apiBaseUrl } from '../Helper';
import { Encryption } from '../authentication/Encryption';

export const loginApi = (email, password) => {
  const rawBody = JSON.stringify({
    username: Encryption(email),
    password: Encryption(password),
  });

  return axios.post(apiBaseUrl("Auth/SapLogin"), rawBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


export const getTopNews = () =>{
        
}

                                                                        