import React, {useState, useEffect} from "react";
import { EmployeeService, AuthService } from "../../services";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const navigate = useNavigate();
	const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  const params = new URLSearchParams(window.location.search);
  // const redirectTo = () => {
	// 	const redirect = params.get('redirect');
  //   const type = params.get('type');
	// 	if (redirect === 'schedule') {
	// 		navigate(`/trans-routes/schedule`);
	// 	} else {
  //     if (type === 'driver') {
  //       navigate(`/trans-routes/dashboard`);
  //     } else {
  //       navigate('/admin');
  //     }
	// 	}
  // }

  // const goToLogin = () => {
  //   navigate(`/login`);
  // }



  useEffect(() => {
    if ((!AuthService.isAdmin() )) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
  }, [])

  const saveEmployee = () => {
    const data = {
      username,
      name,  
      email,
      password,
      phone,
      status: 'active',
      create_by: 'admin',
      edit_by: 'admin',
      roles: roles && roles.replace(' ', '').split(',')
    };
    EmployeeService.createNewEmployee(data);
  };

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>Create New Employee 
             {/* <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button> */}
             </h5> 
        </div>
        {/* {showSaveInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
					 Dispatcher Info Created Successfully. Please contact Admin to Activate your Account before login.
           <button className="btn btn-link btn-sm" onClick={() => goToLogin()}>Go To Login</button>
				</div>} */}
      </div>
      <div className="list row mb-4">
        <div className="col-md-4 mb-4">
          <div>Username (used for login)(*):</div> <input type="text" value={username || ''} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
					<div>Password (used for login)(*):</div> <input type="text" value={password || ''} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
					<div>Name:</div> <input type="text" value={name || ''} onChange={e => setName(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
					<div>Roles:</div> <input type="text" value={roles || ''} onChange={e => setRoles(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
					<div>Email:</div> <input type="email" value={email || ''} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="col-md-4 mb-4">
					<div>Phone :</div> <input type="text" value={phone || ''} onChange={e => setPhone(e.target.value)}/>
        </div>
      </div>
      <div className="list row mb-5">
        <div className="col-md-6 col-sm-6 col-xs-12 mb-4">
          <button className="btn btn-primary btn-sm" onClick={() => saveEmployee()}> Save </button>
          {/* <button className="btn btn-default btn-sm" onClick={() => redirectTo()}> Cancel </button> */}
        </div>
        {/* {showSaveInfo && <div className="col-md-12 mb-4 alert alert-success" role="alert">
					 Dispatcher Info Created Successfully. Please contact Admin to Activate your Account before login.
           <button className="btn btn-link btn-sm" onClick={() => goToLogin()}>Go To Login</button>
				</div>} */}
      </div>
    </>
  );
};

export default CreateEmployee;