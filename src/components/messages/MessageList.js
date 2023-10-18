import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, MessageService } from "../../services";

const MessageList = ({enableMenu}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change a dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    MessageService.getMessages().then(data => {
      console.log(data);
      setMessages(data.data);
    })
  }, []);

  

  const redirectToAdmin = () => {
    navigate(`/reservations/list`)
  }

  const goToEdit = (id) => {
    navigate(`/messages/edit/${id}`)
  }

  const goToCreate = () => {
    navigate(`/messages/`)
  }

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>All Messages <button className="btn btn-link btn-sm" onClick={() => {redirectToAdmin()}}>Back</button>
           <button className="btn btn-link btn-sm" onClick={() => {goToCreate()}}>Go To Create Message Template</button>
           </h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12">
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>Message Group</th>
                <th>Message Name</th>
                <th>Language</th>
                <th>Message Title</th>
                <th>Message Body</th>
                <th></th>
              </tr>
              
            </thead>
            <tbody>
              {
                messages && messages.map(message => <tr key={message.id}>
                  <td>{message?.message_group}</td>
                  <td>{message?.message_name}</td>
                  <td>{message?.language}</td>
                  <td>{message?.message_title}</td>
                  <td>{message?.message_body}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => goToEdit(message?.id)}>Edit</button>
                  </td>
                </tr>)
              }
            </tbody>
          </table>
           
        </div>
      </div>
    </>
  )
};

export default MessageList;