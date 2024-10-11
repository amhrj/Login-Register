import { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState("");
  const [role, setRole] = useState("");

  Axios.defaults.withCredentials = true;

  // Check if the user is logged in
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn === true) {
        setRole(response.data.user[0].role);
        setLoginStatus("You are logged in!");
      }
    }).catch((error) => {
      console.error("Login check failed:", error);
    });
  }, []);

  const register = () => {
    if (usernameReg && passwordReg) {
      Axios.post('http://localhost:3001/register', {
        username: usernameReg,
        password: passwordReg,
      }).then((response) => {
        console.log(response);
        setLoginStatus(response.data.message);
      }).catch((error) => {
        console.error("Registration failed:", error);
        setLoginStatus("Registration failed");
      });
    } else {
      setLoginStatus("Please enter username and password");
    }
  };

  const login = () => {
    if (username && password) {
      Axios.post('http://localhost:3001/login', {
        username: username,
        password: password,
      }).then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setLoginStatus("Login successful!");
          setRole(response.data[0].role); // Assuming role comes from backend
        }
      }).catch((error) => {
        console.error("Login failed:", error);
        setLoginStatus("Login failed");
      });
    } else {
      setLoginStatus("Please enter username and password");
    }
  };

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input type="text" onChange={(e) => setUsernameReg(e.target.value)} /><br />
        <label>Password</label>
        <input type="password" onChange={(e) => setPasswordReg(e.target.value)} /><br />
        <button onClick={register}>Register</button>
      </div>

      <div className="login">
        <h1>Login</h1>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
        <button onClick={login}>Login</button>
      </div>

      <h1>{loginStatus}</h1>
      {role && <h2>Logged in as: {role}</h2>}
    </div>
  );
}

export default App;
