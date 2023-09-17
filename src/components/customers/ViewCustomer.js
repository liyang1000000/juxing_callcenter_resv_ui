import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService, CustomerService, ReservationService, MessageService } from "../../services";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const ViewCustomer = () => {
  const navigate = useNavigate();

  const urlParams = useParams();
  const [currentCustomer, setCurrentCustomer] =  useState(undefined);
  const [reservations, setReservations] = useState([]);
  const [showSuccessInfo, setShowSuccessInfo] = useState(false);
  const [show, setShow] = useState(false);
  const [targetedResv, setTargetedResv] = useState(false);
  // const [currentAvatar, setCurrentAvatar] = useState(undefined);
	
  const redirectTo = () => {
		navigate(`/customers/list`)
  }

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (!currentCustomer) {
      CustomerService.getCustomer(urlParams.id).then((data) => {
        setCurrentCustomer(data?.data);
        if (data?.data?.name && data?.data?.phone) {
          ReservationService.getReservationsByUserInfo(data?.data?.phone, data?.data?.name).then((resvs) => {
            setReservations(resvs?.data);
          });
        }
      })
    }
  }, []);

  const sendMessage = (resv) => {
    const uuid = resv?.resv_uuid;
    const phone = resv?.tel;
    console.log(123123);
    setShowSuccessInfo(false);
    MessageService.getMessages(1, 'English', 'Confirm').then((msgs) => {
      console.log(msgs.data[0]);
      console.log(msgs.data[0]?.message_body.replace('{confimLink}', `${window.location.origin}/resv-confirm/${uuid}`));
      console.log(phone);
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
        // MessageService.sendMessage(data);
        ReservationService.updateReservation(resv?.id, Object.assign({}, resv, {message_sent: true, message_sent_time: new Date()})).then(() => {
          ReservationService.getReservationsByUserInfo(phone, resv.name).then((resvs) => {
            setReservations(resvs?.data);
            setShowSuccessInfo(true);
          });
        })
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
    const date = resv?.resv_time;
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
          if ((Math.abs(new Date() - new Date(date)) / 36e5) >= 24) {
            return 'Past Reservation'
          } else {
            if (messageSent && (Math.abs(new Date() - new Date(messageSentTime)) / 36e5) > 48) {
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
           <h5>{currentCustomer?.name} - {currentCustomer?.phone}   <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12">
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>Date Time</th>
                <th>Party Size</th>
                <th>Room #</th>
                <th>Duration</th>
                <th>Room Rate</th>
                <th>Special Note</th>
                <th>Status</th>
                <th>Encrypted CC</th>
              </tr>
              
            </thead>
            <tbody>
              {
                reservations?.map(resv => (
                  <tr key={resv?.id}>
                    <td>{`${new Date(resv?.resv_time).toLocaleDateString()} ${Math.trunc(resv?.start_time)}:${((resv?.start_time-Math.trunc(resv?.start_time)))*60 === 0 ? '00': (resv?.start_time-Math.trunc(resv?.start_time))*60 }`}</td>
                    <td>{resv?.party_size}</td>
                    <td>{resv?.room}</td>
                    <td>{resv?.duration} Hours</td>
                    <td>{resv?.room_price}</td>
                    <td>{resv?.note}</td>
                    <td>{getStatus(resv)}</td>
                    <td>{ resv?.card_number?.length > 0 && <Button variant="link" size="sm" onClick={() => showCardInfo(resv)}>View</Button>}</td>
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

export default ViewCustomer;