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


const rooms = [{
  label: 'V1(S)',
  size: 1,
  room_number: 1
}, {
  label: 'V2(S)',
  size: 1,
  room_number: 2
}, {
  label: 'V3(S)',
  size: 1,
  room_number: 3
}, {
  label: 'VIP(L)',
  size: 3,
  room_number: 4
}, {
  label: 'V5(M)',
  size: 2,
  room_number: 5
}, {
  label: 'V6(S)',
  size: 1,
  room_number: 6
}, {
  label: 'V7(S)',
  size: 1,
  room_number: 7
}, {
  label: '08(M)',
  size: 2,
  room_number: 8
}, {
  label: 'VIP2(L)',
  size: 3,
  room_number: 9
},{
  label: 'PartyRoom(40)',
  size: 1,
  room_number: 11
}, {
  label: 'VIP3',
  size: 1,
  room_number: 12
}, {
  label: 'Mini1',
  size: 1,
  room_number: 13
}, {
  label: 'Mini2',
  size: 1,
  room_number: 14
}, {
  label: 'MniW',
  size: 2,
  room_number: 15
}, {
  label: 'SW',
  size: 1,
  room_number: 16
}, {
  label: 'SW',
  size: 1,
  room_number: 17
}, {
  label: 'MW',
  size: 2,
  room_number: 18
}, {
  label: 'LW',
  size: 3,
  room_number: 19
}, {
  label: 'Lobby',
  size: 0,
  room_number: 0
}, {
  label: 'Lobby',
  size: 0,
  room_number: 10
}];

const getRoomLabel = (room_number) => {
  return rooms.find((room) => room.room_number === room_number)?.label || ''
};

export const ReservationService = {
  getReservationsByUserInfo,
  updateReservation,
  getReservationsByUUID,
  markMessageSent,
  getRoomLabel
};
