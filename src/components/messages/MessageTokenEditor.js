import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService, MessageService } from "../../services";

const MessageTokenEditor = ({enableMenu}) => {
  const navigate = useNavigate();
  const params = useParams();
	const [messageToken, setMessageToken] = useState('');
  
  const [currentMessageToken, setCurrentMessageToken] =  useState(undefined); 

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change a dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    if (!currentMessageToken) {
      MessageService.getSendMessageToken().then(data => {
        if (data.data && data.data.length > 0) {
          setCurrentMessageToken(data.data[0]);
        }
      })
    }
  }, []);

  useEffect(() => {
    if (currentMessageToken) {
      setMessageToken(currentMessageToken?.message_token);
    }
    
  }, [currentMessageToken])

  const redirectTo = () => {
		navigate(`/reservations/list`);
  }

	const saveMessageToken = () => {
		const data = {
      message_token: messageToken
    };
    if (currentMessageToken) {
      
      MessageService.updateMessageToken(currentMessageToken.id, data).then(() => {
        redirectTo();
      });
    } else {
      MessageService.createMessageToken(data).then(() => {
        redirectTo();
      });
    }
	}

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Update Message Token <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12 mb-4">
          <div>Message Token:</div> <input type="text" value={messageToken || ''} onChange={e => setMessageToken(e.target.value)}/>
        </div>
      </div>
      <div className="list row mb-5">
        <div className="col-md-6 col-sm-6 col-xs-12">
          <button className="btn btn-primary btn-sm me-2 mb-2" onClick={() => saveMessageToken()}> Save </button>
          <button className="btn btn-default btn-sm mb-2" onClick={() => redirectTo()}> Cancel </button>
        </div>
      </div>
    </>
  );
};

export default MessageTokenEditor;