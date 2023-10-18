import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, CustomerService } from "../../services";


const CustomersList = ({enableMenu}) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    
    CustomerService.getAllCustomers().then((data) => {
      setCustomers(data.data.sort((a, b) => a.lastname > b.lastname ? 1: -1));
    })
  }, []);

  const goToView = (id) => {
    navigate(`/customers/${id}`)
  }
  const redirectTo = () => {
    navigate(`/reservations/list`)
  }
  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>All Customers <button className="btn btn-link btn-sm" onClick={() => {redirectTo()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12 mb-4">
          Search By Phone Number: <input className="me-2" type="text" value={keyword}  onChange={(e) => setKeyword(e.currentTarget.value)} />
        </div>
        {/* <div className="col-md-12 mb-4">
          <input className="me-2" type="checkbox" value={showInactive} checked={showInactive === true} onChange={() => setShowInactive(!showInactive)} />
            Show Transferred / Deactivated Customers
        </div> */}
        <div className="col-md-12">
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>Customer Phone</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Date Of Birth</th>
                <th>Reservations</th>
              </tr>
              
            </thead>
            <tbody>
              {
                customers && customers.filter((item) => item?.phone.includes(keyword)).map(customer => <tr key={customer.id}>
                  <td>{customer?.phone}</td>
                  <td>{customer?.name}</td>
                  <td>{customer?.email}</td>
                  <td>{customer?.birthday}</td>
                  <td><button type="button" class="btn btn-link" onClick={() => goToView(customer.id)}>View</button></td>
                </tr>)
              }
            </tbody>
          </table>
           
        </div>
      </div>
    </>
  )
};

export default CustomersList;