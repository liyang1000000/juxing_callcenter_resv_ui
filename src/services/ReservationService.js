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

const getReservationsByDate = (date) => {
  const params = {};
  if (date) {
    params.date = date;
  }
  return http.get('/reservations/tel-and-date', {
    params
  });
}


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

const validateCardNumber = number => {
  //Check if the number contains only numeric value  
  //and is of between 13 to 19 digits
  const regex = new RegExp("^[0-9]{13,19}$");
  if (!regex.test(number)){
      return false;
  }

  return luhnCheck(number);
}

const luhnCheck = val => {
  let checksum = 0; // running checksum total
  let j = 1; // takes value of 1 or 2

  // Process each digit one by one starting from the last
  for (let i = val.length - 1; i >= 0; i--) {
    let calc = 0;
    // Extract the next digit and multiply by 1 or 2 on alternative digits.
    calc = Number(val.charAt(i)) * j;

    // If the result is in two digits add 1 to the checksum total
    if (calc > 9) {
      checksum = checksum + 1;
      calc = calc - 10;
    }

    // Add the units element to the checksum total
    checksum = checksum + calc;

    // Switch the value of j
    if (j == 1) {
      j = 2;
    } else {
      j = 1;
    }
  }

  //Check if it is divisible by 10 or not.
  return (checksum % 10) == 0;
}

const getReservationsLegacy1 = (phone, name) => {
  const params = {};
  if (phone) {
    params.tel = phone;
  }
  if (name) {
    params.name = name;
  }
  return http.get('/reservations-legacy1', {
    params
  });
};

const getReservationsLegacy2 = (phone, name) => {
  const params = {};
  if (phone) {
    params.tel = phone;
  }
  if (name) {
    params.name = name;
  }
  return http.get('/reservations-legacy2', {
    params
  });
};

const updateReservationLegacy1 = (id, data) => {
  return http.put(`/reservations-legacy1/${id}`, data);
}

const updateReservationLegacy2 = (id, data) => {
  return http.put(`/reservations-legacy2/${id}`, data);
}


const legacySiteApi1 = 'http://wokandroll.club:20877/resvs/confirm/';
const legacySiteApi2 = 'http://wokandroll.club:20878/resvs/confirm/';

export const ReservationService = {
  getReservationsByUserInfo,
  updateReservation,
  getReservationsByUUID,
  markMessageSent,
  getRoomLabel,
  legacySiteApi2,
  legacySiteApi1,
  validateCardNumber,
  getReservationsByDate,
  getReservationsLegacy1,
  getReservationsLegacy2,
  updateReservationLegacy1,
  updateReservationLegacy2
};
