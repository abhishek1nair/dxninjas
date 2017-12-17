import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import AppointmentPage from './pages/appointmentcreatepage/AppointmentPage.jsx';
import DoctorPage from './pages/doctorscreen/DoctorPage.jsx';
import ReceptionPage from './pages/receptionpage/ReceptionPage.jsx';
import UserProfilePage from './pages/userprofileform/UserProfilePage.jsx';
import QueuePage from './pages/queuepage/QueuePage.jsx';
import Error404 from './pages/ErrorPage.jsx';
import Header from './Header.jsx';

import './App.css';
import './Animate.css';

class App extends Component {
  render() {
    return (
      <div className='clearfix'>
        <Header/>
        <Router history={hashHistory}>
          <Route path="/appointment" component={AppointmentPage} />
          <Route path="/user-create" component={UserProfilePage} />
          <Route path="/reception" component={ReceptionPage} />
          <Route path="/doctor" component={DoctorPage} />
          <Route path="/queue" component={QueuePage} />
          <Route path="*" component={Error404} />
        </Router>
      </div>
    );
  }
}

export default App;
