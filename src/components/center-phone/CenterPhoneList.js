import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, CenterPhoneService } from "../../services";

const CenterPhoneList = ({enableMenu}) => {
  const navigate = useNavigate();
  const [phones, setPhones] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (!AuthService.isAdmin()) {
      window.alert('You haven\'t login yet OR this user does not have access to this page. Please change an admin account to login.')
      AuthService.logout();
      navigate(`/login`);
    }
    if (AuthService.isAdmin()) {
      enableMenu();
    }
    CenterPhoneService.getAll().then((data) =>
      setPhones(data.data)
    );
  }, []);

  const redirectToAdmin = () => {
    navigate(`/reservations/list`)
  }

  const goToEdit = (id) => {
    navigate(`/center-phones/edit/${id}`)
  }

  
  return (
    <>
      <div className="list row mb-4">
        <div className="col-md-12 text-primary">
           <h5>All Phones <button className="btn btn-link btn-sm" onClick={() => {redirectToAdmin()}}>Back</button></h5> 
        </div>
      </div>
      <div className="list row mb-4">
        <div className="col-md-12">
          <div className="mb-4">Keyword: <input type="text" value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)}/></div>
          <table className="personnel-info-table"> 
            <thead>
              <tr>
                <th>Phone Title</th>
                <th>Phone Number</th>
                <th>Activated</th>
                <th></th>
              </tr>
              
            </thead>
            <tbody>
              {
                phones && phones.filter((item)=> item?.phone_number.includes(keyword) || item?.phone_title.toLowerCase().includes(keyword.toLowerCase())).map(phone => <tr key={phone.id}>
                  <td>{phone?.phone_title}</td>
                  <td>{phone?.phone_number}</td>
                  <td>{phone?.activated ? 'Yes': 'No'}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => goToEdit(phone?.id)}>Edit</button> 
                  </td>
                </tr>)
              }
            </tbody>
          </table>
           
        </div>
      </div>
    </>
  )
};

export default CenterPhoneList;