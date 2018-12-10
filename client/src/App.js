import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';

import NavBar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';


// Check for token so when refreshed it won't log you out
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user infor and exp
  const decode = jwt_decode(localStorage.jwtToken);
  // set user and is authenticated
  store.dispatch(setCurrentUser(decode));

  // Check for expire token
  const currentTime = Date.now()/ 1000;
  if (decode.exp < currentTime) {
    //logout the user if time is up
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    // Redirect to login
    window.location.href = '/login'
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavBar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App;
