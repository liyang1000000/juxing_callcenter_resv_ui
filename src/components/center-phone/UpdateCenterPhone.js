import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService, CenterPhoneService } from "../../services";

const UpdateCenterPhone = ({enableMenu}) => {
  const navigate = useNavigate();
	const [phoneTitle, setPhoneTitle] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
  const [activated, setActivated] = useState(false);
  const [currentPhone, setCurrentPhone] = useState(undefined);
  const urlParams = useParams();

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an Dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    if (!currentPhone) {
      CenterPhoneService.getCenterPhone(urlParams.id).then(data => setCurrentPhone(data.data))
    }

  }, []);

  useEffect(() => {
    if (currentPhone) {
      setPhoneNumber(currentPhone.phone_number);
      setPhoneTitle(currentPhone.phone_title);
      setActivated(currentPhone.activated);
    }
    
  }, [currentPhone])

  const redirectTo = () => {
    navigate('/center-phones/list')
  }

	const savePhone = () => {
		const data = {
			phone_title: phoneTitle,
      phone_number: phoneNumber,
      activated: activated
		};
		CenterPhoneService.updateCenterPhone(urlParams.id, data).then(() => redirectTo())
	}
  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Update Phone <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
				<div className="col-md-4 mb-4">
          <div>Phone Title(*):</div> <input type="text" value={phoneTitle || ''} onChange={e => setPhoneTitle(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
          <div>Phone Number(*):</div> <input type="text" value={phoneNumber || ''} onChange={e => setPhoneNumber(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
          <div>Activated:</div> <input type="checkbox" value={activated} checked={activated === true} onChange={e => setActivated(!activated)}/>
        </div>
      </div>
      <div className="list row mb-5">
        <div className="col-md-6 col-sm-6 col-xs-12">
          <button className="btn btn-primary btn-sm me-2 mb-2" onClick={() => savePhone()}> Save </button>
          <button className="btn btn-default btn-sm mb-2" onClick={() => redirectTo()}> Cancel </button>
        </div>
      </div>
    </>
  );
};

export default UpdateCenterPhone;