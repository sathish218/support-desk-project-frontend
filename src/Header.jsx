import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiFillBuild } from "react-icons/ai";

const BASE_URL = "https://sathish07-support-desk-project.hf.space"; // Local backend

const Header = () => {
  const navigate = useNavigate();
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setIsLoggedIn(true);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  }, []);

  const toggleUserPopup = () => setShowUserPopup(prev => !prev);
  const handleRoleChange = (event) => setRole(event.target.value);
  const toggleForm = () => setIsSignUp(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setShowUserPopup(false);
    navigate("/");
    setRole("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isSignUp ? `${BASE_URL}/signup` : `${BASE_URL}/login`;

    const payload = isSignUp
      ? { name, email, password, role }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", data.token);
      const userData = {
        name: data.name || name,
        email: data.email || email,
        role: data.role || role
      };
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsLoggedIn(true);
      setShowUserPopup(false);

      setName("");
      setEmail("");
      setPassword("");
      setRole("");

      alert(`${isSignUp ? "Sign-up" : "Login"} successful!`);
      navigate("/profile");
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred during submission.");
    }
  };

  return (
    <>
      <HeaderWrapper>
        <div className="logo">
          <h4>
            <AiFillBuild /> SUPPORT DESK
          </h4>
        </div>
        <FaUserCircle className="icon" size={30} onClick={toggleUserPopup} />
      </HeaderWrapper>

      {showUserPopup && (
        <Overlay onClick={toggleUserPopup}>
          <Popup onClick={(e) => e.stopPropagation()}>
            <Close onClick={toggleUserPopup}>×</Close>
            <StyledWrapper>
              {isLoggedIn ? (
                <div className="container">
                  <h3>User Info</h3>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <button className="login-button" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <div className="container">
                  <div className="heading">{isSignUp ? 'Sign Up' : 'Sign In'}</div>
                  <form className="form" onSubmit={handleSubmit}>
                    {isSignUp && (
                      <input
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input"
                      />
                    )}
                    <input
                      placeholder="E-mail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input"
                    />
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="input"
                    />
                    {isSignUp && (
                      <div className="dropdown-container">
                        <label htmlFor="role" className="dropdown-label">Select Role:</label>
                        <select
                          id="role"
                          value={role}
                          onChange={handleRoleChange}
                          className="dropdown-input"
                          required
                        >
                          <option value="">--Select Role--</option>
                          <option value="employee">Employee</option>
                          <option value="IT-Support">IT-Support</option>
                        </select>
                      </div>
                    )}
                    <input type="submit" value={isSignUp ? 'Sign Up' : 'Sign In'} className="login-button" />
                  </form>
                  <div className="agreement">
                    <button onClick={toggleForm} className="link-button">
                      {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                </div>
              )}
            </StyledWrapper>
          </Popup>
        </Overlay>
      )}
    </>
  );
};

// Styled components (unchanged)
const HeaderWrapper = styled.div`
  height: 70px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  .icon {
    cursor: pointer;
    color: #1089d3;
  }

  .logo {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #1089d3;
  }

  .logo h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Popup = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const Close = styled.button`
  position: absolute;
  top: 10px; right: 15px;
  font-size: 28px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const StyledWrapper = styled.div`
  .container {
    max-width: 500px;
    background: linear-gradient(0deg, #fff 0%, #f4f7fb 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid white;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 30px 30px -20px;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }

  .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
  }

  .dropdown-container {
    margin-top: 15px;
  }

  .dropdown-label {
    font-size: 14px;
    color: rgb(170, 170, 170);
    margin-bottom: 5px;
    display: block;
  }

  .dropdown-input {
    width: 100%;
    background: white;
    border: 1px solid #ddd;
    padding: 12px 20px;
    border-radius: 20px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    font-size: 14px;
  }

  .dropdown-input:focus {
    outline: none;
    border-color: #12b1d1;
  }

  .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding: 15px 0;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
  }

  .login-button:hover {
    transform: scale(1.03);
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
  }

  .link-button {
    background: none;
    border: none;
    color: #0099ff;
    font-size: 15px;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default Header;
