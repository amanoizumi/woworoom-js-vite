import { apiPath, myPath } from '../../config.js';

export const getFrontCartsApi = () => {
  return axios.get(`${apiPath}/customer/${myPath}/carts`);
};

export const deleteFrontCartsApi = (id) => {
  return axios.delete(`${apiPath}/customer/${myPath}/carts/${id}`);
};

export const deleteFrontAllCartsApi = () => {
  return axios.delete(`${apiPath}/customer/${myPath}/carts`);
};

export const patchFrontCartsProductNumApi = (obj) => {
  return axios.patch(`${apiPath}/customer/${myPath}/carts`, obj);
};
