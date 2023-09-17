import axios from "axios";
export default axios.create({
  // baseURL: 'environmentUrl'
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});