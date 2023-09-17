import http from "../http-common";
const getInvitation = (id) => {
  return http.get(`/invitations/${id}`);
};

const createInvitation = (data) => {
  return http.post('/invitations', data);
};


const updateInvitation = (id, data) => {
  return http.put(`/invitations/${id}`, data);
}

export const InvitationService = {
    getInvitation,
    updateInvitation,
    createInvitation
};