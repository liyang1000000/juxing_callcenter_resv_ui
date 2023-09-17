import React, {useState, useEffect} from "react";
import { MessageService, ReservationService, CustomerService, hostEmail, emailPassword, InvitationService } from "../../services";
import {useParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const ConfirmReservation = () => {
	const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [reservation, setReservation] = useState(undefined);
  const [existingCustomer, setExistingCustomer] = useState(undefined);
  const [allowStatusUpdate, setAllowStatusUpdate] = useState(false);
  const [allowMarketingMessage, setAllowMarketingMessage] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [agreeTOS, setAgreeTOS] = useState('');
  const [TOS, setTOS] = useState('test');
  const [namePrint, setNamePrint] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState(undefined);
  
  const urlParams = useParams();
  
  const uuid = urlParams.id;
  

  useEffect(() => {
    MessageService.getMessages(3, 'English', 'TOS').then(data => {
      setTOS(data?.data[0]);
    });
    MessageService.getMessages(2, 'English', 'Invitation').then(data => {
      setInviteEmail(data?.data[0]);
    });
    if (!reservation) {
      ReservationService.getReservationsByUUID(uuid).then((data) => {
        setReservation(data?.data[0]);
        if (data?.data[0]) {
          const {id, ...rest} = data?.data[0];
          const arr = [];
          for (let i=0; i < data?.data[0]?.party_size - 1; i++) {
            arr.push({...rest, resv_id: data?.data[0]?.id, invite_name: '', invite_email: '', invite_confirmed: false})
          }
          setInvitations(arr);
        }
        CustomerService.getCustomersByPhoneAndName(data?.data[0]?.name, data?.data[0]?.tel).then((customers) => {
          if (customers?.data?.length>0) {
            setExistingCustomer(customers?.data[0]);
            setAllowStatusUpdate(customers?.data[0]?.allow_status_update);
            setAllowMarketingMessage(customers?.data[0]?.allow_marketing_message);
            setEmail(customers?.data[0]?.email);
            setBirthday(customers?.data[0]?.birthday);
          }
        });
      });
    }
  }, [])

  const confirmResv = () => {
    if (!cardName || cardName.replace(' ', '') === '') {
      setErrorMessage('Please type in your card holder name');
    } else {
      if (!cardNo || cardNo.replace(' ', '') === '') {
        setErrorMessage('Please type in your card number');
      } else {
        if (!expDate || expDate.replace(' ', '') === '') {
          setErrorMessage('Please type in your Card Expiration Date');
        } else {
          if (!cardCVV || cardCVV.replace(' ', '') === '') {
            setErrorMessage('Please type in your CVV');
          } else {
            if (!namePrint || namePrint.replace(' ', '') === '') {
              setErrorMessage('Please Print your Legal Name');
            } else {
              if (!agreeTOS) {
                setErrorMessage('Please agree to the term of service')
              } else {
                if (existingCustomer) {
                  CustomerService.updateCustomer(existingCustomer.id, Object.assign({}, existingCustomer, {
                    email, birthday, allow_status_update: allowStatusUpdate, allow_marketing_message:allowMarketingMessage
                  }))
                }
                ReservationService.updateReservation(reservation.id, Object.assign({}, reservation, {
                  agree_tos: true,
                  status: 2,
                  contacted: 1,
                  card_name: cardName,
                  card_number: window.btoa(cardNo),
                  card_expired: expDate,
                  card_cvv: window.btoa(cardCVV)
                })).then(() => {
                  ReservationService.getReservationsByUUID(uuid).then(data => {
                    setReservation(data?.data[0]);
                  })
                });
              }
            }
          }
        }
      }
    }
  };

  const sendInvitations = () => {
    invitations?.forEach(invite => {
      InvitationService.createInvitation(invite).then((savedInvite) => {
        // Email.send({
        //   Host: "smtp.gmail.com",
        //   Username: hostEmail,
        //   Password: emailPassword,
        //   To: invite?.invite_email,
        //   From: hostEmail,
        //   Subject: inviteEmail?.message_title,
        //   Body: inviteEmail?.message_body?.replace('{invitationLink}', `${window.location.origin}/invitation/${savedInvite?.data?.id}`),
        // }).then(() => console.log(`Email sent to ${invite?.invite_email}`)).catch((err) => console.log(err));
      })
    });
    ReservationService.updateReservation(reservation?.id, Object.assign({}, reservation, {invitation_sent: true})).then(() => {
      ReservationService.getReservationsByUUID(uuid).then(data => {
        setReservation(data?.data[0]);
      })
    });
  }

  
  return (
    <>
      {
        (!reservation || !reservation?.message_sent || reservation?.status === 0) && (<h1>Reservation Doesn't Exist</h1>)
      }
      {
        reservation && reservation?.status === 2 && reservation?.invitation_sent && (<h1>Well Done! You have confirmed your Reservation</h1>)
      }
      {
        reservation && reservation?.status === 2 && !reservation?.invitation_sent && (
          <>
            <div className="list row mb-4">
              <div className="col-md-12 text-primary">
                <h5>
                  Please Send Invitations to Your Guests!
                  {/* <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button> */}
                </h5> 
              </div>
              {/* {showSaveInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
                Dispatcher Info Created Successfully. Please contact Admin to Activate your Account before login.
                <button className="btn btn-link btn-sm" onClick={() => goToLogin()}>Go To Login</button>
              </div>} */}
            </div>
            <div className="list row mb-4">
              {
                
                invitations.map((invite, index) => <>
                  <div className="col-md-6 mb-4">
                    <div>Email:</div> 
                    <input 
                      type="email" 
                      value={invitations[index]?.invite_email || ''} 
                      onChange={e => {
                        const newList = [].concat(invitations);
                        newList[index].invite_email = e.target.value;
                        setInvitations(newList);
                      }}/>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div>Name:</div>
                    <input
                      type="text"
                      value={invitations[index]?.invite_name || ''}
                      onChange={e => {
                        const newList = [].concat(invitations);
                        newList[index].invite_name = e.target.value;
                        setInvitations(newList);
                      }}
                    />
                  </div>
                </>)
                
              }
            </div>
            <div className="list row mb-4">
            <div className="col-md-6 mb-4">
              <Button variant="primary" size="sm" onClick={() => sendInvitations()}>Send</Button>
            </div>
            </div>
          </>
        
        )
      }
      {
        reservation && reservation?.status === 1 && reservation?.message_sent && (Math.abs(new Date() - new Date(reservation?.message_sent_time)) / 36e5) > 48 && (
          <h1>Reservation Link Expired</h1>
        )
      }
      {
        reservation && reservation?.status === 1 && reservation?.message_sent && (Math.abs(new Date() - new Date(reservation?.message_sent_time)) / 36e5) <= 48 && (
          <>  
            <div className="list row mb-4">
              <div className="col-md-12 text-primary">
                <h5>
                  {`${reservation?.name} - ${reservation.tel}`}
                  {/* <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button> */}
                </h5> 
              </div>
              {/* {showSaveInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
                Dispatcher Info Created Successfully. Please contact Admin to Activate your Account before login.
                <button className="btn btn-link btn-sm" onClick={() => goToLogin()}>Go To Login</button>
              </div>} */}
            </div>
            <div className="list row mb-4">
              <div className="col-md-12 mb-4">
                {`${new Date(reservation?.resv_time).toLocaleDateString()} ${Math.trunc(reservation?.start_time)}:${((reservation?.start_time-Math.trunc(reservation?.start_time)))*60 === 0 ? '00': (reservation?.start_time-Math.trunc(reservation?.start_time))*60 }`}
              </div>
              <div className="col-md-12 mb-4">Party for {reservation?.party_size}</div>
              <div className="col-md-12 mb-4">Room {reservation?.room}</div>
              <div className="col-md-12 mb-4">Room Rate: {reservation?.room_price}</div>
              <div className="col-md-12 mb-4">Duration: {reservation?.duration} Hrs</div>
              <div className="col-md-12 mb-4">
                <h6>{TOS?.message_title}</h6>
                <div>{TOS?.message_body}</div>
              </div>
              <div className="col-md-12 mb-4">
                <div>Date of Birth (MM/DD/YYYY):</div> <input type="text" value={birthday || ''} onChange={e => setBirthday(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>Email:</div> <input type="email" value={email || ''} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <input type="checkbox" value={allowStatusUpdate} checked={allowStatusUpdate === true} onChange={e => setAllowStatusUpdate(!allowStatusUpdate)}/> I agree to receive status update message from Wok and Roll
              </div>
              <div className="col-md-12 mb-4">
                <input type="checkbox" value={allowMarketingMessage} checked={allowMarketingMessage === true} onChange={e => setAllowMarketingMessage(!allowMarketingMessage)}/> I agree to receive marketing text message
              </div>
              <div className="col-md-12 mb-4">
                <input type="checkbox" required value={agreeTOS} checked={agreeTOS === true} onChange={e => setAgreeTOS(!agreeTOS)}/> I agree to TOS
              </div>
              <div className="col-md-12 mb-4">
                <div>Print legal name here to sign(*):</div> <input required type="text" value={namePrint || ''} onChange={e => setNamePrint(e.target.value)}/>
              </div>
              <hr></hr>
              <div className="col-md-12 mb-4">
                <div>Cardhoder name(*):</div> <input required type="text" value={cardName || ''} onChange={e => setCardName(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>Card number(*):</div> <input required type="text" value={cardNo || ''} onChange={e => setCardNo(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>Exp date (MM/YYYY) (*):</div> <input required type="text" value={expDate || ''} onChange={e => setExpDate(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>CVV (*):</div> <input required type="text" value={cardCVV || ''} onChange={e => setCardCVV(e.target.value)}/>
              </div>
            </div>
            <div className="list row mb-5">
              <div className="col-md-6 col-sm-6 col-xs-12 mb-4">
                <button className="btn btn-primary btn-sm" onClick={() => confirmResv()}> Submit </button>
                {/* <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button> */}
              </div>
              <div className="col-md-12">
              {errorMessage && 
              
                (<div className="col-md-12 mb-4 alert alert-danger" role="alert">
                  {errorMessage}
                </div>)
              }
              </div>
              {/* {showSaveInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
                Dispatcher Info Created Successfully. Please contact Admin to Activate your Account before login.
                <button className="btn btn-link btn-sm" onClick={() => goToLogin()}>Go To Login</button>
              </div>} */}
            </div>

          </>
        )
      }
      
    </>
  );
};

export default ConfirmReservation;