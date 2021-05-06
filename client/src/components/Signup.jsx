import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import { AuthContext } from "./App.jsx"

export default function Signup({ history }) {

	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const [formMsg, setFormMsg] = useState("")
	const { setCurrentUser } = useContext(AuthContext)


	const handleSubmit = e => {
		e.preventDefault();

		if (username && email && password && passwordConfirm) {
			if (password === passwordConfirm) {
				let userObj = { username, email, password };
				axios.post("https://api.tastepeak.com/api/accounts", userObj, {withCredentials: true})
					.then(({ data }) => {
						console.log("sign up res", data)
						if (data.status === "success") {
							setCurrentUser(data.data.username)
							history.push("/")
						} else {
							setFormMsg("Username is already taken")
						}
					})
					.catch(err => console.log(err))
			} else {
				setFormMsg("Passwords dont match")
			}
		} else {
			setFormMsg("Please complete the form before submitting")
		}
	}

	useEffect(() => {
		const formInputs = document.querySelectorAll(".form-input");
		const signupLink = document.querySelector(".signup-li")
		signupLink.classList.add("active");

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

		return () => {
			formInputs.forEach(input => {
				input.removeEventListener("focus", () => {
					input.classList.add("focus");
				})
				input.removeEventListener("blur", () => {
					if (input.value === "") {
						input.classList.remove("focus");
					}
				})
			})

			signupLink.classList.remove("active");
		}
	}, [])


	return (
		<div className="page-container signup-page">
			<form className="signup-form">
				<h1>Sign Up</h1>
				<div className="input-wrapper">
					<input name="username" type="text" className="form-input" autoComplete="off"
						value={username} onChange={e => setUsername(e.target.value)} />
					<span className="input-label">Username</span>
					<span className="input-underline"></span>
				</div>
				<div className="input-wrapper">
					<input name="email" type="text" className="form-input" autoComplete="off"
						value={email} onChange={e => setEmail(e.target.value)} />
					<span className="input-label">Email</span>
					<span className="input-underline"></span>
				</div>
				<div className="input-wrapper">
					<input name="password" type="password" className="form-input"
						value={password} onChange={e => setPassword(e.target.value)} />
					<span className="input-label">Password</span>
					<span className="input-underline"></span>
				</div>
				<div className="input-wrapper">
					<input name="password" type="password" className="form-input"
						value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
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

