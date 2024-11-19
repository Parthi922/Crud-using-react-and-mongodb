import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [Filterusers, setFilterusers] = useState([]);
  const [isModelopen, setIsModelopen] = useState(false);
  const [userData, setUserData] = useState({ id: null, name: "", age: "", city: "" });

  // getAllUsers function using .then() structure
  const getAllUsers = async () => {
    await axios.get("http://127.0.0.1:3000/users/").then((res) => {
      setUsers(res.data);
      setFilterusers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search Function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterusers(filteredUsers);
  };

  // Delete User function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://127.0.0.1:3000/users/${id}`).then(() => {
        getAllUsers();
      });
    }
  };

  const closeModel = () => {
    setIsModelopen(false);
    setUserData({ id: null, name: "", age: "", city: "" });
  };

  // Add User Details
  const handleAddRecord = () => {
    setUserData({ id: null, name: "", age: "", city: "" });
    setIsModelopen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      // Update existing user
      await axios.patch(`http://127.0.0.1:3000/users/${userData.id}`, userData).then(() => {
        getAllUsers();
      });
    } else {
      // Add new user
      await axios.post("http://127.0.0.1:3000/users/", userData).then(() => {
        getAllUsers();
      });
    }
    closeModel();
  };

  // Populate form with existing data for update
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModelopen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
        <div className="input-search">
          <input type="search" placeholder="Search Text Here" onChange={handleSearchChange} />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Filterusers &&
              Filterusers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn green" onClick={() => handleUpdateRecord(user)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="btn red" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isModelopen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={closeModel}>
                &times;
              </span>
              <h2>{userData.id ? "Update User" : "Add User"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    name="name"
                    id="name"
                    onChange={handleData}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    value={userData.age}
                    name="age"
                    id="age"
                    onChange={handleData}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    value={userData.city}
                    name="city"
                    id="city"
                    onChange={handleData}
                  />
                </div>
                <button className="btn green" type="submit">
                  {userData.id ? "Update User" : "Add User"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
