import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Container from 'react-bootstrap/Container';
import CreateEmployee from "./components/employees/CreateEmployee";
import Login from "./components/login/Login";
import CreateMessage from "./components/messages/CreateMessage";
import UpdateMessage from "./components/messages/UpdateMessage";
import MessageList from "./components/messages/MessageList";
import CreateCenterPhone from "./components/center-phone/CreateCenterPhone";
import UpdateCenterPhone from "./components/center-phone/UpdateCenterPhone";
import CenterPhoneList from "./components/center-phone/CenterPhoneList";
import MessageTokenEditor from "./components/messages/MessageTokenEditor";
import SendMessage from "./components/messages/SendMessage";
import SentMessageList from "./components/messages/SentMessageList";
import CustomersList from "./components/customers/CustomersList";
import ViewCustomer from "./components/customers/ViewCustomer";
import Invitation from "./components/invitation/Invitation";
import ConfirmReservation from "./components/reservation/ConfirmReservation";

function App() {

  return (
    <>
      <div className="logo">
        <img src={'logo192.png'}/>
      </div>
      <div className="container container-fixed">
        <Router>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login /> } />
            
            <Route path="/employees" element={<CreateEmployee /> } />
            
            <Route path="/customers" element={<Navigate replace to="/customers/list" /> } />
            <Route path="/customers/list" element={<CustomersList/> } />
            <Route path="/customers/:id" element={<ViewCustomer /> } />
            
            <Route path="/center-phones" element={<CreateCenterPhone /> } />
            <Route path="/center-phones/edit/:id" element={<UpdateCenterPhone />} />
            <Route path="/center-phones/list" element={<CenterPhoneList/> } />

            <Route path="/messages" element={<CreateMessage /> } />
            <Route path="/messages/edit/:id" element={<UpdateMessage />} />
            <Route path="/messages/list" element={<MessageList/> } />
            <Route path="/message-tokens" element={<MessageTokenEditor/>} />
            <Route path="/messages/send-message" element={<SendMessage/>} />
            <Route path="/messages/sent-messages/list" element={<SentMessageList />} />

            <Route path="/resv-confirm/:id" element={<ConfirmReservation />} />
            <Route path="/invitation/:id" element={<Invitation />} />

          </Routes>
        </Router>
      </div>
    </>
    
  );
}

export default App;