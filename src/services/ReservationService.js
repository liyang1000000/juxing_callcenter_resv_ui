import http from "../http-common";
const getReservationsByUserInfo = (phone, name) => {
  const params = {};
  if (phone) {
    params.tel = phone;
  }
  if (name) {
    params.name = name;
  }
  return http.get('/reservations', {
    params
  });
};

const getReservationsByUUID = (uuid) => {
  const params = {};
  if (uuid) {
    params.resv_uuid = uuid;
  }
  return http.get('/reservations/uuid', {
    params
  });
};


const updateReservation = (id, data) => {
  return http.put(`/reservations/${id}`, data);
}

const markMessageSent = (id, data) => {
  data.message_sent = true;
  return http.put(`/reservations/${id}`, data);
}

export const ReservationService = {
  getReservationsByUserInfo,
  updateReservation,
  getReservationsByUUID,
  markMessageSent
};
