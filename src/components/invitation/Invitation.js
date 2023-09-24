import React, {useState, useEffect} from "react";
import { CustomerService, InvitationService, ReservationService } from "../../services";
import {useParams} from 'react-router-dom';

const Invitation = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [invitation, setInvitation] = useState(undefined);
  const [existingCustomer, setExistingCustomer] = useState(undefined);
  const [allowStatusUpdate, setAllowStatusUpdate] = useState(false);
  const [allowMarketingMessage, setAllowMarketingMessage] = useState(false);
  
  const urlParams = useParams();

  const invitationId = urlParams.id;

  useEffect(() => {
    if (!invitation) {
      InvitationService.getInvitation(invitationId).then((data) => {
        setInvitation(data?.data);
        setName(data?.data?.invite_name);
        setEmail(data?.data?.invite_email);
        setPhone(data?.data?.invite_phone);
        setBirthday(data?.data?.invite_dob);
        CustomerService.getCustomersByEmailAndName(data?.data?.invite_name, data?.data?.invite_email).then((customers) => {
          if (customers?.data?.length>0) {
            setExistingCustomer(customers.data[0]);
            setAllowStatusUpdate(customers.data[0]?.allow_status_update);
            setAllowMarketingMessage(customers.data[0]?.allow_marketing_message);
            setEmail(customers.data[0]?.email);
            setBirthday(customers.data[0]?.birthday);
          }
        });
      });
    }
  }, [])

  const updateInvitation = () => {
    if (existingCustomer) {
      CustomerService.updateCustomer(existingCustomer.id, Object.assign({}, existingCustomer, { phone, email, birthday, allow_status_update: allowStatusUpdate, allow_marketing_message:allowMarketingMessage }))
    } else {
      CustomerService.createCustomer({
        name,
        email,
        phone,
        birthday,
        allow_status_update: allowStatusUpdate,
        allow_marketing_message:allowMarketingMessage
      })
    }
    InvitationService.updateInvitation(invitationId, Object.assign({}, invitation, { invite_email: email, invite_phone: phone, invite_dob: birthday, invite_confirmed: true })).then(() => {
      InvitationService.getInvitation(invitationId).then(data => {
        setInvitation(data?.data);
      })
    });
  };

  
  return (
    <>
      {
        !invitation && (<h1>Invitation Expired</h1>)
      }
      {
        invitation && invitation.invite_confirmed && (<h1>Well Done! You have confirmed your invitation</h1>)
      }
      {
        invitation && !invitation.invite_confirmed && (
          <>  
            <div className="list row mb-4">
              <div className="col-md-12 text-primary">
                <h5>
                  {`Hello! ${name}, ${invitation?.name} invites you to a party.`}
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
                {`${new Date(invitation?.resv_time).toLocaleDateString()} ${Math.trunc(invitation?.start_time)}:${((invitation?.start_time-Math.trunc(invitation?.start_time)))*60 === 0 ? '00': (invitation?.start_time-Math.trunc(invitation?.start_time))*60 }`}
              </div>
              <div className="col-md-12 mb-4">Party for {invitation?.party_size}</div>
              <div className="col-md-12 mb-4">Room: {ReservationService.getRoomLabel(invitation?.room)}</div>
              <div className="col-md-12 mb-4">Duration: {invitation?.duration} Hrs</div>
              <div className="col-md-12 mb-4">
                <div>Date of Birth(MM/DD/YYYY):</div> <input type="text" value={birthday || ''} onChange={e => setBirthday(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>Email:</div> <input type="email" value={email || ''} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <div>Phone :</div> <input type="text" value={phone || ''} onChange={e => setPhone(e.target.value)}/>
              </div>
              <div className="col-md-12 mb-4">
                <input type="checkbox" value={allowStatusUpdate} checked={allowStatusUpdate === true} onChange={e => setAllowStatusUpdate(!allowStatusUpdate)}/> I agree to receive status update message from Wok and Roll
              </div>
              <div className="col-md-12 mb-4">
                <input type="checkbox" value={allowMarketingMessage} checked={allowMarketingMessage === true} onChange={e => setAllowMarketingMessage(!allowMarketingMessage)}/> I agree to receive marketing text message
              </div>
            </div>
            <div className="list row mb-5">
              <div className="col-md-6 col-sm-6 col-xs-12 mb-4">
                <button className="btn btn-primary btn-sm" onClick={() => updateInvitation()}> Submit </button>
                {/* <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button> */}
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

export default Invitation;