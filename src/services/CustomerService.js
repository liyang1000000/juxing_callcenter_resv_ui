import http from "../http-common";

const getAllCustomers = () => {
  return http.get('/customers');
};

const getCustomersByPhoneAndName = (name, phone) => {
  const params = {name, phone}
  return http.get(
    '/customers/getByPhoneAndName',
    {params}
  )
};

const getCustomersByEmailAndName = (name, email) => {
  const params = {name, email}
  return http.get(
    '/customers/getByEmailAndName',
    {params}
  )
};

const createCustomer = (data) => {
  return http.post('/customers', data);
};

const updateCustomer = (id, data) => {
  return http.put(`/customers/${id}`, data);
}

const getCustomer = (id) => {
  return http.get(`customers/${id}`);
}


export const CustomerService = {
  getCustomer,
  getAllCustomers,
  getCustomersByPhoneAndName,
  createCustomer,
  updateCustomer,
  getCustomersByEmailAndName
};
