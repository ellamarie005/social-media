import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register User function
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    // the catch here allows for the errors in state to be set to the error messages set in the backend
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login  - Get User Token
export const loginUser = userData => dispatch => {
  axios.post('api/users/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data
      // set token to localStorage -- when using setItem it will store items as strings
      localStorage.setItem('jwtToken', token)
      // set token to Auth Header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
};

//Set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}
