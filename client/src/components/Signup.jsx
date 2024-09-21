import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import { Context } from "./App.jsx"

export default function Signup({ history }) {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [formMsg, setFormMsg] = useState("")
  const { setCurrentUser } = useContext(Context)


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !passwordConfirm) {
      return setFormMsg("Please complete the form before submitting")
    }
    if (password !== passwordConfirm) {
      return setFormMsg("Passwords dont match")
    }
    try {
      const userObj = { username, email, password }
      // const signupUrl = process.env.NODE_ENV === 'development' ? '/api/signup' : 'https://api.tastepeak.com/api/signup'
      const signupUrl = '/api/signup'
      const { data } = await axios.post(signupUrl, userObj, { withCredentials: true })
      console.log("sign up response", data)
      setCurrentUser(data.data.username)
      history.push("/")
    } catch (error) {
      console.log(error)
      setFormMsg(error.response.data.message)
    }
  }

  useEffect(() => {
    const formInputs = document.querySelectorAll(".form-input");
    const signupLink = document.querySelector(".signup-li")

    if (signupLink) {
      signupLink.classList.add("active");
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
    <div className="page-container signup-page">
      <form className="signup-form">
        <h1>Sign Up</h1>
        <div className="input-wrapper">
          <input name="username" type="text" className="form-input" autoComplete="off"
            value={username} onChange={e => setUsername(e.target.value.trim())} />
          <span className="input-label">Username</span>
          <span className="input-underline"></span>
        </div>
        <div className="input-wrapper">
          <input name="email" type="text" className="form-input" autoComplete="off"
            value={email} onChange={e => setEmail(e.target.value.trim())} />
          <span className="input-label">Email</span>
          <span className="input-underline"></span>
        </div>
        <div className="input-wrapper">
          <input name="password" type="password" className="form-input"
            value={password} onChange={e => setPassword(e.target.value.trim())} />
          <span className="input-label">Password</span>
          <span className="input-underline"></span>
        </div>
        <div className="input-wrapper">
          <input name="password" type="password" className="form-input"
            value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value.trim())} />
          <span className="input-label">Confirm Password</span>
          <span className="input-underline"></span>
        </div>
        <button className="form-btn" onClick={handleSubmit}>Sign Up</button>
        <p className="form-msg">{formMsg}</p>
        <p className="form-text">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  )
}

