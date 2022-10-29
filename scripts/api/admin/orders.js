import { apiPath, myPath, token } from '../../config.js';

export const getAdminOrdersApi = () => {
  return axios.get(`${apiPath}/admin/${myPath}/orders`, token);
};

export const deleteAdminOrderApi = (id) => {
  return axios.delete(`${apiPath}/admin/${myPath}/orders/${id}`, token);
};

export const deleteAdminAllOrdersApi = () => {
  return axios.delete(`${apiPath}/admin/${myPath}/orders`, token);
};

export const putAdminOrderApi = (obj) => {
  return axios.put(`${apiPath}/admin/${myPath}/orders`, obj, token);
};
