import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, MessageService } from "../../services";
import DatePicker from "react-datepicker";

const SentMessageList = ({enableMenu}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [datePicked, setDatePicked] = useState(new Date());

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change a dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    MessageService.getSentMessages().then(data => {
      console.log(data);
      setMessages(data.data);
    })
  }, []);

  

  const redirectToAdmin = () => {
    navigate(`/reservations/list`)
  }

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>All Sent Messages <button className="btn btn-link btn-sm" onClick={() => {redirectToAdmin()}}>Back</button>
           </h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="mb-4">
          Pick a Date to Filter: 
        </div>
        <div className="col-md-4 col-sm-4 col-xs-12 mb-4">
          <DatePicker selected={datePicked} onChange={(v) => setDatePicked(v)} />
        </div>
        <div className="col-md-12">
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Message</th>
                <th>Sent Time</th>
              </tr>
              
            </thead>
            <tbody>
              {
                messages && messages.filter((message) => (new Date(message?.create_date))?.toLocaleDateString() === (new Date(datePicked)).toLocaleDateString()).map(message => <tr key={message.id}>
                  <td>{message?.from}</td>
                  <td>{message?.to}</td>
                  <td>{message?.content}</td>
                  <td>{`${new Date(message?.create_date)?.toLocaleDateString()} ${new Date(message?.create_date)?.toLocaleTimeString()}`}</td>
                </tr>)
              }
            </tbody>
          </table>
           
        </div>
      </div>
    </>
  )
};

export default SentMessageList;