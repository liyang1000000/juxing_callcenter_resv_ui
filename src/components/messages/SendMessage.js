import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, MessageService } from "../../services";
import Select from 'react-select';

const SendMessage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change a dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    MessageService.getMessages().then(data => setMessageTemplateList(data.data));
  }, []);
  const [contactPhone, setContactPhone] = useState('');

  const [messageTemplate, setMessageTemplate] = useState('');
  const [messageText, setMessageText] = useState('');
 
  const [messageTempateList, setMessageTemplateList] = useState([]);
  const [showSuccessInfo, setShowSuccessInfo] = useState(false);

  const redirectTo = () => {
    navigate(`/customers`);
  }

  const sendMessage = () => {
    setShowSuccessInfo(false);
    const data = {
      messages: [{
        contactPhone: contactPhone,
        mode: 'AUTO',
        text: messageText
      }]
    };
	  MessageService.sendMessage(data).then(() => setShowSuccessInfo(true));
  }


  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Send Message <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12 mb-4">
          <div>Type in Phone Number:</div> <input type="text" value={contactPhone || ''} onChange={e => setContactPhone(e.target.value)}/>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 mb-4">
          <div>Select Message Template (Not Required):</div>
          <Select value={messageTemplate || ''} onChange={selectedData => {setMessageTemplate(selectedData); setMessageText(selectedData.value)}} options={[{value: '', label: ''}, ...messageTempateList.map(template => ({
            value: template.message_body || '',
            label: template.message_body || '',
          }))]}></Select>
        </div>
		    <div className="col-md-12 mb-4">
          <div>Message Text:</div> <textarea value={messageText || ''} onChange={e => setMessageText(e.target.value)}/>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-12 mb-4">
          <button className="btn btn-primary btn-sm" onClick={() => sendMessage()}> Send Message </button>
          <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button>
        </div>
        
        {showSuccessInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
					 Message Sent!
				</div>}
      </div>
    </>
  );
};

export default SendMessage;