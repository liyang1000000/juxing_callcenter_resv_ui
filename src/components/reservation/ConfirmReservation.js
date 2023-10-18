import React, {useState, useEffect} from "react";
import { MessageService, ReservationService, CustomerService, hostEmail, emailPassword, InvitationService } from "../../services";
import {useParams} from 'react-router-dom';
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
  const [backspaceFlag, setBackspaceFlag] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(undefined);
  const [hideForm, setHideForm] = useState(false);
  
  const urlParams = useParams();
  
  const uuid = urlParams.id;
  

  useEffect(() => {
    MessageService.getMessages(3, 'TOS').then(data => {
      setTOS(data?.data[0]);
    });
    MessageService.getMessages(2, 'Invitation').then(data => {
      setInviteEmail(data?.data[0]);
    });
    MessageService.getMessages(2, 'ResvConfirmed').then(data => {
      setConfirmEmail(data?.data[0]);
    })
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
            setBirthday( (!customers?.data[0]?.birthday || customers?.data[0]?.birthday === '') ? undefined : new Date(customers?.data[0]?.birthday));
          }
        });
      });
    }
  }, [])

  const handleCardDisplay = () => {
    const rawText = [...cardNo.split(' ').join('')] // Remove old space
    const creditCard = [] // Create card as array
    rawText.forEach((t, i) => {
        if (i % 4 === 0 && i !== 0) creditCard.push(' ') // Add space
        creditCard.push(t)
    })
    return creditCard.join('') // Transform card array to string
  }

  const isExpiredValid = (value) => {
    if (value && value.includes('/')) {
      const arr = value.split('/');
      if (arr.length > 1) {
        const month = parseInt(arr[0]);
        const year = parseInt(arr[1]);
        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        if (year > currentYear) {
          return true;
        } else {
          if (year < currentYear) {
            return false;
          } else {
            if (month >= currentMonth) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false
      }
      
    } else {
      return false
    }
  }

  const handleExpirationDate = (text) => {
    let textTemp = text;
    if (textTemp[0] !== '1' && textTemp[0] !== '0') {
      textTemp = '';
    }
    if (textTemp.length === 2) {
      if (parseInt(textTemp.substring(0, 2)) > 12 || parseInt(textTemp.substring(0, 2)) == 0) {
        textTemp = textTemp[0];
      } else if (text.length === 2 && !backspaceFlag) {
        textTemp += '/';
        setBackspaceFlag(true);
      } else if (text.length === 2 && backspaceFlag) {
        textTemp = textTemp[0];
        setBackspaceFlag(false);
      } else {
        textTemp = textTemp[0];
      }
    }
    setExpDate(textTemp);
  };

  const confirmResv = () => {
    if (!cardName || cardName.replace(' ', '') === '') {
      setErrorMessage('Please type in your card holder name');
    } else { 
      if (!cardNo || cardNo.replaceAll(' ', '') === '') {
        setErrorMessage('Please type in your card number');
      } else {
        if (!ReservationService.validateCardNumber(cardNo.replaceAll(' ', ''))) {
          setErrorMessage('You Credit Card Number is not valid. Please type in again.')
        } else {
          if (!expDate || expDate.replace(' ', '') === '') {
            setErrorMessage('Please type in your Card Expiration Date');
          } else {
            if (!isExpiredValid(expDate)) {
              setErrorMessage('Your Credit Card is expired. Please use another card please.')
            } else {
              if (!cardCVV || cardCVV.replace(' ', '') === '') {
                setErrorMessage('Please type in your CVV');
              } else {
                if (cardCVV.length>4 || cardCVV.length<3 || !(/^\d+$/.test(cardCVV))) {
                  setErrorMessage('Your CVV is not valid, please type in again');
                } else {
                  if (!namePrint || namePrint.replace(' ', '') === '') {
                    setErrorMessage('Please Print your Legal Name');
                  } else {
                    if (!agreeTOS) {
                      setErrorMessage('Please agree to the term of service')
                    } else {
                      if (!email || !email.includes('@') || email.replace(' ', '') === '') {
                        setErrorMessage('Please type in a valid email address')
                      } else {
                        if (existingCustomer) {
                          CustomerService.updateCustomer(existingCustomer.id, Object.assign({}, existingCustomer, {
                            email, birthday: new Date(birthday).toLocaleDateString('es-pa'), allow_status_update: allowStatusUpdate, allow_marketing_message:allowMarketingMessage
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
                          setHideForm(true);
                          // ReservationService.getReservationsByUUID(uuid).then(data => {
                          //   setReservation(data?.data[0]);
                          // });
                          const data = {
                            emailTemplate: {
                              message_title: confirmEmail?.message_title,
                              message_body: confirmEmail?.message_body?.replace('{resvLink}', `${window.location.origin}/resv-confirm/${reservation?.resv_uuid}`),
                            },
                            from: 'no-reply@wokandrolldc.com',
                            to: email
                          }
                          console.log(data);
                          MessageService.sendEmail(data).catch(err => console.log(err));
                          
                        });
                        
                        Promise.all([
                          ReservationService.updateReservationLegacy1(reservation?.resv_legacy_id, {status: 2, contacted: 1}).catch(error => console.log(error)),
                          ReservationService.updateReservationLegacy2(reservation?.resv_legacy_id, {status: 2, contacted: 1}).catch(error => console.log(error))
                          // axios.put(`${ReservationService.legacySiteApi1}${reservation?.resv_legacy_id}`, {status: 2, contacted: 1}).catch(error => console.log(error)),
                          // axios.put(`${ReservationService.legacySiteApi2}${reservation?.resv_legacy_id}`, {status: 2, contacted: 1}).catch(error => console.log(error))
                        ]).then(data => {
                          console.log('success update legacy data', data);
                        }).catch(error => console.log(error))
                      }
                    }
                    
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const sendInvitations = () => {
    invitations?.forEach(invite => {
      if (invite?.invite_email && invite?.invite_email?.replace(' ', '') !== '') {
        InvitationService.createInvitation(invite).then((savedInvite) => {
          const data = {
            emailTemplate: {
              message_title: inviteEmail?.message_title,
              message_body: inviteEmail?.message_body?.replace('{invitationLink}', `${window.location.origin}/invitation/${savedInvite?.data?.id}`),
            },
            from: 'no-reply@wokandrolldc.com',
            to: invite?.invite_email
          }
          MessageService.sendEmail(data).then(() => {
            
          }).catch(err => console.log(err));
          ReservationService.updateReservation(reservation?.id, Object.assign({}, reservation, {invitation_sent: true})).then(() => {
            ReservationService.getReservationsByUUID(uuid).then(data => {
              setReservation(data?.data[0]);
            })
          });
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
      }
      
    });
  }

  
  return (
    <div className="client-page">
      <div className="main">
          <div className="container">
              <div className="booking-content">
                  <div className="booking-image">
                      <img className="booking-img" src={'/images/form-img.jpg'} alt="Booking Image" />
                  </div>
                  <div className="booking-form">
                  {
                    (!reservation || !reservation?.message_sent || reservation?.status === 0) && (<div className="title-only"><h2>Reservation Doesn't Exist</h2></div>)
                  }
                  {
                    reservation && reservation?.status === 2 && reservation?.invitation_sent && (<div className="title-only"><h2>Well Done! You have confirmed your Reservation</h2></div>)
                  }
                  {
                    reservation && reservation?.status === 1 && reservation?.message_sent && (Math.abs(new Date() - new Date(reservation?.message_sent_time)) / 36e5) > 48 && (
                      <div className="title-only"><h2>Reservation Link Expired</h2></div>
                    )
                  }
                  {
                    reservation && reservation?.status === 2 && !reservation?.invitation_sent && (
                      <div id="booking-form">
                        <h2>Your Reservation is Confirmed. You Can Send Invitations to Your Guests Now!</h2>
                        {
                          invitations.map((invite, index) => <>
                            <div className="form-group form-input">
                              <input type="email" id={`invitation_email_${index}`} name={`invitation_email_${index}`} value={invitations[index]?.invite_email || ''} 
                                onChange={e => {
                                  const newList = [].concat(invitations);
                                  newList[index].invite_email = e.target.value;
                                  setInvitations(newList);
                                }}
                              />
                              <label for={`invitation_email_${index}`} className="form-label">Guest's Email</label>
                            </div>
                            <div className="form-group form-input">
                              <input type="text" id={`guest_name_${index}`} name={`guest_name_${index}`} value={invitations[index]?.invite_name || ''}
                                onChange={e => {
                                  const newList = [].concat(invitations);
                                  newList[index].invite_name = e.target.value;
                                  setInvitations(newList);
                                }}/>
                              <label for={`guest_name_${index}`} className="form-label">Guest's Name</label>
                            </div>
                          </>)
                        }
                        <div className="form-submit">
                          <button className="btn btn-primary btn-sm submit" onClick={() => sendInvitations()}> Send Now </button>
                        </div>
                      </div>
                    )
                  }
                  {
                    !hideForm && reservation && reservation?.status === 1 && reservation?.message_sent && (Math.abs(new Date() - new Date(reservation?.message_sent_time)) / 36e5) <= 48 && (
                      <div id="booking-form">
                        <div className="avatar-container"><img src="/images/avatar.jpg"></img></div>
                        <h1 className="hello">Hello</h1>
                        <h2>{`${reservation?.name} - ${reservation.tel}`}</h2>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Party Time</span>
                          <input disabled type="text" id="partyTime" name="partyTime" value={`${reservation?.resv_time?.split('T')[0]} ${Math.trunc(reservation?.start_time)}:${((reservation?.start_time-Math.trunc(reservation?.start_time)))*60 === 0 ? '00': (reservation?.start_time-Math.trunc(reservation?.start_time))*60 }`}/>
                          
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Party Size</span>
                          <input disabled type="text" id="partySize" name="partySize" value={reservation?.party_size}/>
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Room</span>
                          <input disabled type="text" id="room" name="room" value={ReservationService.getRoomLabel(reservation?.room)}/>
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Room Rate</span>
                          <input disabled type="text" id="roomPrice" name="roomPrice" value={reservation?.room_price}/>
                        </div>
                        <div className="form-group form-input form-no-padding">
                          <span className="checkbox-title">Duration</span>
                          <input disabled type="text" id="duration" name="duration" value={`${reservation?.duration} Hrs`} />
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
                          <input required type="email" id="email" name="email" value={email || ''} onChange={e => setEmail(e.target.value)}/>
                          <label for="email" className="form-label">Your Email (*)</label>
                        </div>
                        <div className="form-group form-input">
                          <span className="checkbox-title">I agree to receive status update message from Wok and Roll</span>
                          <input className="checkbox-widget" name="allowStatusUpdate" id="allowStatusUpdate" type="checkbox" value={allowStatusUpdate} checked={allowStatusUpdate === true} onChange={e => setAllowStatusUpdate(!allowStatusUpdate)}/>
                          
                        </div>
                        <div className="form-group form-input">
                          <span className="checkbox-title">I agree to receive marketing text message</span>
                          <input className="checkbox-widget" type="checkbox" name="agreeMarketing" id="agreeMarketing" value={allowMarketingMessage} checked={allowMarketingMessage === true} onChange={e => setAllowMarketingMessage(!allowMarketingMessage)}/> 
                        </div>
                        <div className="form-group form-input">
                          {/* <h6 className="aos-title">{TOS?.message_title}</h6> */}
                          <div className="aos-content" dangerouslySetInnerHTML={{__html: TOS?.message_body?.replace('{reservation_name}', reservation?.name)?.replace('{reservation_date}', `${reservation?.resv_time?.split('T')[0]}`)?.replace('{reservation_no_people}', reservation?.party_size).replace('{reservation_time}', `${Math.trunc(reservation?.start_time)}:${((reservation?.start_time-Math.trunc(reservation?.start_time)))*60 === 0 ? '00': (reservation?.start_time-Math.trunc(reservation?.start_time))*60 }`)?.replace('{reservation_duration}', `${reservation?.duration} Hrs`)?.replace('{reservation_price}', reservation?.room_price)}}></div>
                        </div>
                        <div className="form-group form-input">
                          <span className="checkbox-title">I agree to the Terms and Conditions(*)</span>
                          <input className="checkbox-widget" type="checkbox" id="agreeTOS" name="agreeTOS" required value={agreeTOS} checked={agreeTOS === true} onChange={e => setAgreeTOS(!agreeTOS)}/> 
                        </div>
                        <div className="form-group form-input">
                          <input id="namePrint" name="namePrint" required type="text" value={namePrint || ''} onChange={e => setNamePrint(e.target.value)}/> 
                          <label for="namePrint" className="form-label">Print legal name here to sign(*)</label>
                        </div>
                       
                        <div className="form-group form-input">
                          <input id="cardName" name="cardName" required type="text" value={cardName || ''} onChange={e => setCardName(e.target.value)}/>
                          <label for="cardName" className="form-label">Cardhoder name(*)</label>
                        </div>
                        <div className="form-group form-input">
                          <input required id="cardNo" maxlength="23"
                            pattern="[0-9\s]*"
                            inputmode="numeric" name="cardNo" type="text" value={handleCardDisplay() || ''} 
                            onChange={e => setCardNo(e.target.value)}/>
                          <label for="cardNo" className="form-label">Card number(*)</label>
                        </div>
                        <div className="form-group form-input">
                          <input id="expDate" keyboardType={'numeric'}
                           name="expDate" required type="text" value={expDate || ''} onChange={e => handleExpirationDate(e.target.value)}/>
                          <label for="expDate" className="form-label">Exp date (MM/YYYY) (*)</label>
                        </div>
                        <div className="form-group form-input">
                          <input required id="cardCVV" pattern="[0-9]*"
                            inputmode="numeric" name="cardCVV" type="text" value={cardCVV || ''} onChange={e => setCardCVV(e.target.value)}/>
                          <label for="cardCVV" className="form-label">CVV (*)</label>
                        </div>
                        
                        <div className="form-submit">
                          <button className="btn btn-primary btn-sm submit" onClick={() => confirmResv()}> Confirm Now </button>
                        </div>
                        {errorMessage &&  
                          (<div className="col-md-12 mb-4 alert alert-danger alert-container" role="alert">
                            {errorMessage}
                          </div>)
                        }
                      </div>
                    )
                  }
                  {
                    hideForm && reservation && reservation?.status === 1 && reservation?.message_sent && (Math.abs(new Date() - new Date(reservation?.message_sent_time)) / 36e5) <= 48 && (
                      <div className="title-only"><h2>Congratulations! Your reservation is confirmed!</h2></div>
                    )
                  }
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ConfirmReservation;
