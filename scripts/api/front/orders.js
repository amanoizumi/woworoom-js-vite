import { apiPath, myPath } from '../../config.js';

export const postFrontOrderApi = (obj) => {
  return axios.post(`${apiPath}/customer/${myPath}/orders`, obj);
};
