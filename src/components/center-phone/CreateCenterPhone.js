import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, CenterPhoneService } from "../../services";

const CreateCenterPhone = () => {
  const navigate = useNavigate();
	const [phoneTitle, setPhoneTitle] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an Dispatcher or admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
  }, []);


  const redirectTo = () => {
    navigate(`/customers`);
  }

	const savePhone = () => {
		const data = {
			phone_title: phoneTitle,
			phone_number: phoneNumber
		};
		CenterPhoneService.createNewCenterPhone(data).then(() => {
			navigate(`/center-phones/list`)
		});
	}

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Create New Center Phone Item <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
				<div className="col-md-4 mb-4">
          <div>Phone Title(*):</div> <input type="text" value={phoneTitle || ''} onChange={e => setPhoneTitle(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
          <div>Phone Number(*):</div> <input type="text" value={phoneNumber || ''} onChange={e => setPhoneNumber(e.target.value)}/>
        </div>
      </div>
      <div className="list row mb-5">
        <div className="col-md-6 col-sm-6 col-xs-12">
          <button className="btn btn-primary btn-sm" onClick={() => savePhone()}> Save </button>
          <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button>
        </div>
      </div>
    </>
  );
};

export default CreateCenterPhone;