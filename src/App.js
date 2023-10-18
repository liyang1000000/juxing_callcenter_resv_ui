import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthService } from "./services";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
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
import ReservationsList from "./components/reservation/ReservationsList";

function App() {
  // const navigate = useNavigate();
  const goToSystem1 = () => {
    window.open(`https://resvs1.wokandroll.club/scheduler`);
  }
  const goToSystem2 = () => {
    window.open(`https://resvs2.wokandroll.club/scheduler`);
  }
  const goToCustomerList = () => {
    window.location.href = `/customers/list`;
  }
  const goToCreateMessage = () => {
    window.location.href = `/messages/`;
  }

  const goToMessageList = () => {
    window.location.href = `/messages/list`;
  }

  const goToCreatePhone = () => {
    window.location.href = `/center-phones`;
  }

  const goToPhoneList = () => {
    window.location.href = `/center-phones/list`;
  }

  const goToCreateMessageToken = () => {
    window.location.href = `/message-tokens`;
  }

  const goToSendMessage = () => {
    window.location.href = `/messages/send-message`;
  }

  const goToAllSentMessages = () => {
    window.location.href = `/messages/sent-messages/list`;
  }

  const goToReservationList = () => {
    window.location.href = `/reservations/list`;
  }

  const [isAdmin, setIsAdmin] = useState(false);
  const enableMenu = () => {
    setIsAdmin(true);
  }

  
  
  return (
    <>
      {(!window.location.href.includes('resv-confirm') && !window.location.href.includes('invitation')) && <div className="logo">
        <img src={'/images/juxing_logo.jpg'}/>
      </div>}
      
      <div className={`container container-fixed ${(window.location.href.includes('resv-confirm') || window.location.href.includes('invitation')) ? 'client-bg': ''}`}>
       {
          isAdmin && !window.location.href.includes('resv-confirm') && !window.location.href.includes('login') && !window.location.href.includes('invitation') && (
          <div className="list row">
            <div className="col-md-12">
              <Navbar bg="light" expand="lg" className="admin-nav mb-4">
                <Container>
                  {/* <Navbar.Brand>Customers Admin</Navbar.Brand> */}
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    {<Nav className="me-auto">
                      <Nav.Link onClick={() => goToReservationList()}>Reservations</Nav.Link>
                    </Nav>}
                    {<Nav className="me-auto">
                      <Nav.Link onClick={() => goToCustomerList()}>Customers</Nav.Link>
                    </Nav>}
                    {<Nav className="me-auto">
                      <NavDropdown title="Messages Templates" id="basic-nav-dropdown">
                        <NavDropdown.Item  onClick={() => goToCreateMessage()}>
                          Create New Message Template
                        </NavDropdown.Item>
                        <NavDropdown.Item   onClick={() => goToMessageList()}>
                          View Message Templates List
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>}
                    {<Nav className="me-auto">
                      <NavDropdown title="Admin Phone" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => goToCreatePhone()}>
                          Create New Admin Phone
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => goToPhoneList()}>
                          View Admin Phones List
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>}
                    { <Nav className="me-auto">
                      <NavDropdown title="Messages" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => goToSendMessage()}>
                          Send Message
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => goToCreateMessageToken()}>
                          Edit Message Token
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => goToAllSentMessages()}>
                          View All Sent Messages
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>}
                    {<Nav className="me-auto">
                      <Nav.Link onClick={() => goToSystem1()}>Reservation System 1</Nav.Link>
                    </Nav>}
                    {<Nav className="me-auto">
                      <Nav.Link onClick={() => goToSystem2()}>Reservation System 2</Nav.Link>
                    </Nav>}
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </div>
          </div>
         )
       } 
        <Router>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login /> } />
            
            <Route path="/employees" element={<CreateEmployee /> } />
            
            <Route path="/customers" element={<Navigate replace to="/customers/list" /> } />
            <Route path="/customers/list" element={<CustomersList enableMenu={enableMenu}/> } />
            <Route path="/customers/:id" element={<ViewCustomer enableMenu={enableMenu}/> } />
            
            <Route path="/center-phones" element={<CreateCenterPhone enableMenu={enableMenu}/> } />
            <Route path="/center-phones/edit/:id" element={<UpdateCenterPhone enableMenu={enableMenu} />} />
            <Route path="/center-phones/list" element={<CenterPhoneList enableMenu={enableMenu}/> } />

            <Route path="/messages" element={<CreateMessage enableMenu={enableMenu}/> } />
            <Route path="/messages/edit/:id" element={<UpdateMessage enableMenu={enableMenu}/>} />
            <Route path="/messages/list" element={<MessageList enableMenu={enableMenu}/> } />
            <Route path="/message-tokens" element={<MessageTokenEditor enableMenu={enableMenu}/>} />
            <Route path="/messages/send-message" element={<SendMessage enableMenu={enableMenu}/>} />
            <Route path="/messages/sent-messages/list" element={<SentMessageList enableMenu={enableMenu}/>} />

            <Route path="/resv-confirm/:id" element={<ConfirmReservation />} />
            <Route path="/invitation/:id" element={<Invitation />} />
            <Route path="/reservations/list" element={<ReservationsList enableMenu={enableMenu}/>} />

          </Routes>
        </Router>
      </div>
    </>
    
  );
}

export default App;