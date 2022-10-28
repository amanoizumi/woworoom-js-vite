import { apiPath, myPath } from '../../config.js';

export const getFrontProductsApi = () => {
  return axios.get(`${apiPath}/customer/${myPath}/products`);
};
