import axios from 'axios';

const API_ENDPOINT = 'http://10.0.1.2:5000';

export const createUser = ({
  name,
  email,
  phone,
  faceId
}) => axios({
  method: 'POST',
  url: `${API_ENDPOINT}/user`,
  data: {
    name,
    email_id: email,
    contact: phone,
    face_id: faceId
  }
});

export default {};
