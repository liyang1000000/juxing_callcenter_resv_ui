import { notInitialized } from "react-redux/es/utils/useSyncExternalStore";
import http from "../http-common";

const getMessagesByGroupAndLanguage = (message_group, language) => {
  const params = {};
  if (message_group) {
    params.message_group = message_group;
  }
  if (language) {
    params.language = language;
  }
  return http.get('/messages/search', {
    params
  }); 
}

const createMessage = (data) => {
	return http.post('/messages', data);
};

const updateMessage = (id, data) => {
  return http.put(`/messages/${id}`, data);
}

const getMessage = (id) => {
  return http.get(`/messages/${id}`);
}

const getMessages = (message_group=null, language=null, message_name=null) => {
  const params = {};
  if (message_group) {
    params.message_group = message_group;
  }
  if (language) {
    params.language = language;
  }
  if (message_name) {
    params.message_name = message_name;
  }
  return http.get(`/messages`, {params});
}

const getSendMessageToken = () => {
  return http.get(`/message-tokens`)
}

const createMessageToken = (data) => {
  return http.post('/message-tokens', data);
}

const updateMessageToken = (id, data) => {
  return http.put(`/message-tokens/${id}`, data);
}

const sendMessage = (data) => {
  return http.post(`/messages/public/send`, data);
}

const getSentMessages = () => {
  return http.get(`/messages/sent-messages/all`);
}

export const MessageService = {
  getMessage,
  getMessages,
  updateMessage,
  createMessage,
  getMessagesByGroupAndLanguage,
  getSendMessageToken,
  updateMessageToken,
  createMessageToken,
  sendMessage,
  getSentMessages
};
