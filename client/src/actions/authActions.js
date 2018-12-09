import { GET_ERRORS } from './types';
import axios from 'axios';

// Register User function
export const registerUser = userData => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => console.log(res.data))
    // the catch here allows for the errors in state to be set to the error messages set in the backend
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};