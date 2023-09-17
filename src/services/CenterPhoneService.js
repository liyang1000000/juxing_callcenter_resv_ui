import http from "../http-common";
const getAll = (activated) => {
  const params = {};
  if (activated !== undefined ) {
    params.activated = activated;
  }
  return http.get("/phones");
};
const updateCenterPhone = (id, data) => {
  return http.put(`/phones/${id}`, data)
};
const createNewCenterPhone = (data) => {
	return http.post('/phones', data);
};
const getCenterPhone = (id) => {
  return http.get(`/phones/${id}`);
};

export const CenterPhoneService = {
  getAll,
  updateCenterPhone,
  createNewCenterPhone,
  getCenterPhone
};
