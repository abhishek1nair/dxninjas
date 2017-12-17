import axios from 'axios';
import constants from '../constants/constants.js';

const API_ENDPOINT = constants.API_ENDPOINT;

export const createUser = ({ name, email, phone, faceId }) => axios({
  method: 'POST',
  url: `${API_ENDPOINT}/user`,
  data: {
    name,
    email_id: email,
    contact: phone,
    face_id: faceId
  }
});

export const getQueueAppointments = () => axios({
  method: 'GET',
  url: `${API_ENDPOINT}/appointments`
});

export const matchUser = ({
  faceId
}) => Promise.resolve({
  name: 'Abhishek',
  email_id: 'abhishek.alchemist@gmail.com',
  contact: '+919686202991',
  face_id: '5410001743ab64935982'
});

export const createAppointment = ({
  phone,
  appointment,
  problem
}) => axios({
  method: 'POST',
  url: `${API_ENDPOINT}/appointment`,
  data: {
    contact: phone,
    appointment_time: appointment,
    symptoms: problem
  }
});

export const patchAppointment = ({
  patchData,
  appointmentId
}) => axios({
  method: 'PATCH',
  url: `${API_ENDPOINT}/appointment/${appointmentId}`,
  data: patchData
});

export const getAppointment = ({
  faceIds,
}) => {
  const faceIdParams = faceIds.map(f => `face_ids=${f}`).join('&');
  return axios({
    method: 'GET',
    url: `${API_ENDPOINT}/appointment?${faceIdParams}`
  });
};

export default {};
