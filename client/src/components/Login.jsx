import React, { useEffect, useState, useContext } from 'react'
import axios from "axios"
import { Context } from "./App.jsx"

export default function Login({ history }) {
  const { setCurrentUser } = useContext(Context)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formMsg, setFormMsg] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return setFormMsg("Please complete the form before submitting")
    }
    try {
      const loginUrl = process.env.NODE_ENV === 'development' ? '/api/login' : 'https://api.tastepeak.com/api/login'
      const { data } = await axios.post(loginUrl, { username, password })
      setCurrentUser(data.data.username)
      history.push("/")
    } catch (error) {
      setFormMsg(error.response.data.message)
    }
  }

  useEffect(() => {
    const formInputs = document.querySelectorAll(".form-input");
    const loginLink = document.querySelector(".login-li")

    if (loginLink) {
      loginLink.classList.add("active");
    }

    formInputs.forEach(input => {
      input.addEventListener("focus", () => {
        input.classList.add("focus");
        setFormMsg("")
      })
      input.addEventListener("blur", () => {
        if (input.value === "") {
          input.classList.remove("focus");
        }
      })
    })

  }, [])

  return (
    <div className="page-container login-page">
      <form className="login-form">
        <h1>Login</h1>
        <div className="input-wrapper">
          <input name="username" type="text" className="form-input" autoComplete="off"
            value={username} onChange={e => setUsername(e.target.value.trim())} />
          <span className="input-label">Username</span>
          <span className="input-underline"></span>
        </div>
        <div className="input-wrapper">
          <input name="password" type="password" className="form-input"
            value={password} onChange={e => setPassword(e.target.value.trim())} />
          <span className="input-label">Password</span>
          <span className="input-underline"></span>
        </div>
        <button className="form-btn" onClick={handleSubmit}>Login</button>
        <p className="form-msg">{formMsg}</p>
        <p className="form-text">Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  )
}

