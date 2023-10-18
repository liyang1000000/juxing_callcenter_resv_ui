import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, ReservationService, MessageService } from "../../services";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const ReservationsList = ({enableMenu}) => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [showSuccessInfo, setShowSuccessInfo] = useState(false);
  const [show, setShow] = useState(false);
  const [targetedResv, setTargetedResv] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [currentAvatar, setCurrentAvatar] = useState(undefined);

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
        enableMenu();
      }
    
  }, []);

  useEffect(() => {
    if (selectedDate) {
        ReservationService.getReservationsByDate(selectedDate.toLocaleDateString()).then((data) => {
          setReservations(data?.data);
        });
    }
  }, [selectedDate])

  const sendMessage = (resv) => {
    const uuid = resv?.resv_uuid;
    const phone = resv?.tel;
    setShowSuccessInfo(false);
    MessageService.getMessages(1, 'Confirm').then((msgs) => {
      if (msgs.data) {
        const data = {
          messages: [
            {
              contactPhone: phone,
              mode: 'AUTO',
              text: msgs.data[0]?.message_body.replace('{confimLink}', `${window.location.origin}/resv-confirm/${uuid}`)
            }
          ]
        }
        MessageService.sendMessage(data).then(() => {
          ReservationService.updateReservation(resv?.id, Object.assign({}, resv, {message_sent: true, message_sent_time: new Date()})).then(() => {
          ReservationService.getReservationsByDate(selectedDate.toLocaleDateString()).then((resvs) => {
            setReservations(resvs?.data);
            setShowSuccessInfo(true);
          });
        })
        });
        
      }
    })

  }

  const showCardInfo = (resv) => {
    setTargetedResv(resv);
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
    setTargetedResv(undefined);
  }

  const getStatus = (resv) => {
    const date = resv?.resv_time_abs;
    const start = resv?.start_time;
    const statusCode = resv?.status; 
    const messageSent = resv?.message_sent;
    const messageSentTime = resv?.message_sent_time;
    if (statusCode === 2) {
      return 'Customer Confirmed';
    } else {
      if (statusCode === 0) {
        return 'Canceled';
      } else {
        if (statusCode === 1) {
          if ((new Date() - (new Date(date + start * 36e5 + new Date().getTimezoneOffset() * 60 * 1000))) / 36e5 >= 24) {
            return 'Past Reservation'
          } else {
            if (messageSent && ((new Date() - new Date(messageSentTime)) / 36e5) > 48) {
              return 'Link Expired';
            } else {
              if (!messageSent) {
                return <a onClick={() => {sendMessage(resv)}}>Message Ready To Send</a>
              } else {
                return 'Message sent';
              }
            }
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   if (currentCustomer?.id ) {
  //     CustomerService.getAvatar(currentCustomer?.id).then((data) => {
  //       setCurrentAvatar(data.data);
  //     })
  //   }
  // }, [currentCustomer]);
  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Reservations</h5>
        </div>

       
      </div>
      <div className="list row mb-4">
        <div className="col-md-12 mb-4">
           Select the Date:
           <DatePicker id="selectedDate" name="selectedDate" selected={selectedDate} onChange={(v) => setSelectedDate(v)} />
        </div>
        <div className="col-md-12">
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>Date Time</th>
                <th>Party Size</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Room #</th>
                <th>Duration</th>
                <th>Room Rate</th>
                <th>Special Note</th>
                <th>Status</th>
                <th>Encrypted CC</th>
                <th>Client Confirmation Link</th>
              </tr>
              
            </thead>
            <tbody>
              {
                reservations?.map(resv => (
                  <tr key={resv?.id}>
                    <td>{`${resv?.resv_time?.split('T')[0]} ${Math.trunc(resv?.start_time)}:${((resv?.start_time-Math.trunc(resv?.start_time)))*60 === 0 ? '00': (resv?.start_time-Math.trunc(resv?.start_time))*60 }`}</td>
                    <td>{resv?.party_size}</td>
                    <td>{resv?.name}</td>
                    <td>{resv?.tel}</td>
                    <td>{ReservationService.getRoomLabel(resv?.room)}</td>
                    <td>{resv?.duration} Hours</td>
                    <td>{resv?.room_price}</td>
                    <td>{resv?.note}</td>
                    <td>{getStatus(resv)}</td>
                    <td>{ resv?.card_number?.length > 0 && <Button variant="link" size="sm" onClick={() => showCardInfo(resv)}>View</Button>}</td>
                    <td><a target="_blank" href={`${window.location.origin}/resv-confirm/${resv?.resv_uuid}`}>{ `${window.location.origin}/resv-confirm/${resv?.resv_uuid}` }</a></td>
                  </tr>)
                )
              }
            </tbody>
          </table>
           
        </div>
      </div>
      {showSuccessInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
        Message Sent!
      </div>}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Card Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>Card Holder Name: {targetedResv?.card_name}</li>
            <li>Card Number: {targetedResv?.card_number?.length > 0 && window.atob(targetedResv?.card_number)}</li>
            <li>Expired Date: {targetedResv?.card_expired}</li>
            <li>Card CVV: {targetedResv?.card_cvv?.length > 0 && window.atob(targetedResv?.card_cvv)}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationsList;