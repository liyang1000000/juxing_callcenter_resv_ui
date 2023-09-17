import http from "../http-common";
const getAllEmployees = (role, status) => {
  const params = {};
  if (role) {
    params.roles = role;
  }
  if (status) {
    params.status = status;
  }
  return http.get('/employees', {
    params
  });
};

const getEmployee = (id) => {
  return http.get(`/employees/${id}`);
}

const createNewEmployee = (data) => {
  data.status = 'active';
	return http.post('/employees', data);
};

const updateEmployee = (id, data) => {
  return http.put(`/employees/${id}`, data);
}

const deleteEmployee = (id, data) => {
  data.status = 'inactive';
  return http.put(`/employees/${id}`, data);
}

export const EmployeeService = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
};
