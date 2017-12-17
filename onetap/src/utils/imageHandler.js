import axios from 'axios';
import constants from '../constants/constants';

const DEFAULT_GALLERY = 'practolensev2';

export const enroll = ({
  image,
  subjectId,
  galleryName = DEFAULT_GALLERY
}) => axios({
  method: 'POST',
  url: 'https://api.kairos.com/enroll',
  headers: {
    app_id: constants.KAIROS_APP_ID,
    app_key: constants.KAIROS_APP_KEY
  },
  data: {
    image,
    subject_id: subjectId,
    gallery_name: galleryName
  }
});

export const recognize = ({
  image,
  galleryName = DEFAULT_GALLERY
}) => axios({
  method: 'POST',
  url: 'https://api.kairos.com/recognize',
  headers: {
    app_id: constants.KAIROS_APP_ID,
    app_key: constants.KAIROS_APP_KEY
  },
  data: {
    image,
    gallery_name: galleryName
  }
});

window.kairos = {
  enroll,
  recognize
};

export default {};
