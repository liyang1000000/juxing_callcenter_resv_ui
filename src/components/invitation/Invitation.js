import React, {useState, useEffect} from "react";
import { CustomerService, InvitationService, ReservationService } from "../../services";
import {useParams} from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
            setBirthday( (!customers?.data[0]?.birthday || customers?.data[0]?.birthday === '') ? undefined : new Date(customers?.data[0]?.birthday));
          }
        });
      });
    }
  }, [])

  const updateInvitation = () => {
    if (existingCustomer) {
      CustomerService.updateCustomer(existingCustomer.id, Object.assign({}, existingCustomer, { phone, email, birthday: new Date(birthday).toLocaleDateString('es-pa'), allow_status_update: allowStatusUpdate, allow_marketing_message:allowMarketingMessage }))
    } else {
      CustomerService.createCustomer({
        name,
        email,
        phone,
        birthday: new Date(birthday).toLocaleDateString('es-pa'),
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
      <div className="client-page">
      <div className="main">
          <div className="container">
              <div className="booking-content">
                  <div className="booking-image">
                      <img className="booking-img" src={'/images/form-img.jpg'} alt="Booking Image" />
                  </div>
                  <div className="booking-form">
                  {
                    (!invitation) && (<div className="title-only"><h2>Invitation Expired</h2></div>)
                  }
                  {
                    invitation && invitation.invite_confirmed && (<div className="title-only"><h2>Well Done! You have confirmed your invitation</h2></div>)
                  }
                  {
                    invitation && !invitation.invite_confirmed && (
                      <div id="booking-form">
                        <h2>{`Hello! ${name}, ${invitation?.name} invites you to a party.`}</h2>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Party Time</span>
                          <input disabled type="text" id="partyTime" name="partyTime" value={`${new Date(invitation?.resv_time).toLocaleDateString()} ${Math.trunc(invitation?.start_time)}:${((invitation?.start_time-Math.trunc(invitation?.start_time)))*60 === 0 ? '00': (invitation?.start_time-Math.trunc(invitation?.start_time))*60 }`}/>
                          
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Party Size</span>
                          <input disabled type="text" id="partySize" name="partySize" value={invitation?.party_size}/>
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Room</span>
                          <input disabled type="text" id="room" name="room" value={ReservationService.getRoomLabel(invitation?.room)}/>
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Duration</span>
                          <input disabled type="text" id="duration" name="duration" value={`${invitation?.duration} Hrs`} />
                        </div>
                        
                        <div className="form-group form-input">
                        <label for="birthday" className="form-label-date">Your Date of Birth (MM/DD/YYYY)</label>
                          <DatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select" id="birthday" name="birthday" selected={birthday} onChange={(v) => setBirthday(v)} />
                        </div>
                        <div className="form-group form-input">
                          <input type="email" id="email" name="email" value={email || ''} onChange={e => setEmail(e.target.value)}/>
                          <label for="email" className="form-label">Your Email</label>
                        </div>
                        <div className="form-group form-input">
                          <input type="text" id="phone" name="phone" value={phone || ''} onChange={e => setPhone(e.target.value)}/>
                          <label for="phone" className="form-label">Your Phone</label>
                        </div>
                        <div className="form-group form-input">
                          <span className="checkbox-title">I agree to receive status update message from Wok and Roll</span>
                          <input className="checkbox-widget" name="allowStatusUpdate" id="allowStatusUpdate" type="checkbox" value={allowStatusUpdate} checked={allowStatusUpdate === true} onChange={e => setAllowStatusUpdate(!allowStatusUpdate)}/>
                          
                        </div>
                        <div className="form-group form-input">
                          <span className="checkbox-title">I agree to receive marketing text message</span>
                          <input className="checkbox-widget" type="checkbox" name="agreeMarketing" id="agreeMarketing" value={allowMarketingMessage} checked={allowMarketingMessage === true} onChange={e => setAllowMarketingMessage(!allowMarketingMessage)}/> 
                        </div>
                        <div className="form-submit">
                          <button className="btn btn-primary btn-sm submit" onClick={() => updateInvitation()}> Submit </button>
                        </div>
                      
                      </div>
                    )
                  }
                  </div>
              </div>
          </div>

      </div>
    </div>
    </>
  );
};

export default Invitation;