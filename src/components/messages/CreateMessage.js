import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, MessageService } from "../../services";

const CreateMessage = ({enableMenu}) => {
  const navigate = useNavigate();
  useEffect(() => {
	if (!AuthService.isAdmin()) {
		window.alert('You haven\'t login yet OR this user does not have access to this page. Please change a dispatcher or admin account to login.')
		AuthService.logout();
		navigate(`/login`);
	  }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
  }, []);
  const [messageGroup, setMessageGroup] = useState();
  const [messageName, setMessageName] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [language, setLanguage] = useState('');

  const redirectTo = () => {
    navigate(`/messages/list`);
  }

  const saveMessage = () => {
	const data = {
		message_group: messageGroup,
		message_title: messageTitle,
		message_body: messageBody,
		message_name: messageName,
		language: language
	};
	MessageService.createMessage(data).then(() => redirectTo())
  }

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Create New Message Template <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
		<div className="col-md-4 mb-4">
	  	  <div>Message Group (*Required):</div> 
			<select value={messageGroup} onChange={e => setMessageGroup(e.target.value)} required>
				<option value=""></option>
				<option value={1}>Text Message</option>
				<option value={2}>Email</option>
        <option value={3}>Term Of Service</option>
			</select>
        </div>
        <div className="col-md-4 mb-4">
          <div>Message Name:</div> <input type="text" value={messageName || ''} onChange={e => setMessageName(e.target.value)}/>
        </div>
		{/* <div className="col-md-4 mb-4">
		  <div>Language:</div>
		  	<select value={language} onChange={e => setLanguage(e.target.value)}>
			  	<option value=""></option>
				<option value="English">English</option>
				<option value="Chinese">Chinese</option>
				<option value="Vietnamese">Vietnamese</option>
				<option value="Korean">Korean</option>
			</select>
        </div> */}
      <div className="col-md-12 mb-4">
		  <div>Message Title:</div> <input type="text" value={messageTitle || ''} onChange={e => setMessageTitle(e.target.value)}/>
        </div>
        <div className="col-md-12 mb-4">
		  <div>Message Body:</div> <textarea value={messageBody || ''} onChange={e => setMessageBody(e.target.value)}/>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12">
          <button className="btn btn-primary btn-sm" onClick={() => saveMessage()}> Save </button>
          <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button>
        </div>
      </div>
    </>
  );
};

export default CreateMessage;