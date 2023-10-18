import React, {useEffect, useState} from "react";
import {AuthService} from './../../services';
import { useNavigate } from "react-router-dom";

const Login = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('user') && localStorage.getItem('token') && AuthService.isAdmin()) {
      navigate('/reservations/list');
    }
  }, []);
  const loginAndRedirect = () => {
    AuthService.login({
      emailUsername: username,
      password
    }).then(({data}) => {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/reservations/list');
    }).catch((error) => {
      window.alert(error?.response?.data?.message);
      console.log(error);
    })
  };
  return (
    <div className="list row">
      <div className="col-md-12 login">
        <h3 className="mb-4">Login To JuXing Reservation System</h3>
        <div className="login-container mt-4">
          <div className="mb-4"><input type="text" placeholder="Username OR Email" value={username} onChange={(e) => setUsername(e.currentTarget.value)}></input></div>
          <div className="mb-4"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)}></input></div>
          <div className="mb-2"><button className="btn btn-primary btn-login" onClick={() => loginAndRedirect()}>Login</button></div>
        </div>
      </div>
    </div>
  );
};

export default Login;