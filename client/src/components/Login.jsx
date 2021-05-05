import React, { useEffect, useState, useContext } from 'react'
import axios from "axios"
import { AuthContext } from "./App.jsx"

export default function Login({ history }) {
	const { currentUser, setCurrentUser } = useContext(AuthContext)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [formMsg, setFormMsg] = useState("")


	const handleSubmit = e => {
		e.preventDefault();

		if (username && password) {
			axios.post("https://taste-peak-server.herokuapp.com/api/login", { username, password })
				.then(({ data }) => {
					if (data.status === "failure") {
						setFormMsg(data.message)
					} else {
						setCurrentUser(data.data.username)
						history.push("/")
					}
				})
		} else {
			setFormMsg("please complete the form before submitting")
		}
	}

	useEffect(() => {
		const formInputs = document.querySelectorAll(".form-input");
		const loginLink = document.querySelector(".login-li")
		loginLink.classList.add("active");

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

			loginLink.classList.remove("active");
		}
	}, [])


	return (
		<div className="page-container login-page">
			<form className="login-form">
				<h1>Login</h1>
				<div className="input-wrapper">
					<input name="username" type="text" className="form-input" autoComplete="off"
						value={username} onChange={e => setUsername(e.target.value)} />
					<span className="input-label">Username</span>
					<span className="input-underline"></span>
				</div>
				<div className="input-wrapper">
					<input name="password" type="password" className="form-input"
						value={password} onChange={e => setPassword(e.target.value)} />
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

