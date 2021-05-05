import React, { useRef, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { AuthContext } from "./App.jsx"
import { LocationContext } from "./App.jsx"
import axios from "axios"

export default function Nav() {

	const { currentUser, setCurrentUser } = useContext(AuthContext)
	const { defaultLocation } = useContext(LocationContext)
	const navLinksRef = useRef(null)
	const menuIconRef = useRef(null)
	const accMenuRef = useRef(null)

	const toggleMenu = e => {
		document.querySelector(".menu-icon").classList.toggle("active")
	}

	const handleClickOutsideNavbarLinks = e => {
		if (navLinksRef.current &&
			!navLinksRef.current.contains(e.target) &&
			!menuIconRef.current.contains(e.target) &&
			document.getElementById("menu-icon").classList.contains("active")) {
			document.getElementById("menu-icon").classList.remove("active")
		}
	}

	const handleClickOutsideAccMenu = e => {
		const userImg = document.querySelector(".user-img");
		if (accMenuRef.current &&
			!accMenuRef.current.contains(e.target) &&
			userImg &&
			!userImg.contains(e.target) &&
			accMenuRef.current.classList.contains("active")) {
			accMenuRef.current.classList.remove("active")
		}
	}

	const handleWindowScroll = e => {
		const navbar = document.querySelector(".navbar");

		if (window.scrollY > 0) {
			navbar.classList.add("sticky");
		}

		if (window.scrollY === 0) {
			navbar.classList.remove("sticky");
		}
	}

	const handleLogout = () => {
		axios.get("https://taste-peak-server.herokuapp.com/api/logout")
			.then(({ data }) => {
				if (data.status === "success") {
					setCurrentUser(undefined);
				}
			})
			.catch(err => console.log(err))
	}

	const toggleAccountMenu = () => {
		const accountMenu = document.querySelector(".account-menu");
		accountMenu.classList.toggle("active")
	}
	useEffect(() => {
		const navbarLinks = document.querySelectorAll(".navbar ul.navbar-links > li");

		// navbarLinks.forEach( link => {
		// 	link.addEventListener("click", e => {
		// 		// e.preventDefault();
		// 		navbarLinks.forEach(link => {
		// 			link.classList.remove("active");
		// 		})
		// 		link.classList.add("active");
		// 		console.log("remove active then add active")
		// 	})
		// })
		document.addEventListener('mousedown', handleClickOutsideNavbarLinks);
		document.addEventListener('mousedown', handleClickOutsideAccMenu);
		window.addEventListener("scroll", handleWindowScroll);

		return () => {
			document.removeEventListener('mousedown', handleClickOutsideNavbarLinks);
			document.removeEventListener('mousedown', handleClickOutsideAccMenu);
			window.removeEventListener("scroll", handleWindowScroll);
		}

	}, [])

	return (
		<div className="navbar">
			<a href="/" className="navbar-logo link">TastePea<span>k</span></a>
			<div id="menu-icon" className="menu-icon" onClick={toggleMenu} ref={menuIconRef}>
				<div className="line-1 menu-icon-line"></div>
				<div className="line-2 menu-icon-line"></div>
				<div className="line-3 menu-icon-line"></div>
			</div>
			<ul className="navbar-links" ref={navLinksRef}>
				<li className="home-li navbar-link"><a href="/">Home</a></li>
				{!currentUser && <li className="login-li navbar-link"><a href="/login">Login</a></li>}
				{!currentUser && <li className="signup-li navbar-link"><a href="/signup">Sign Up</a></li>}
				<li className="about-li navbar-link"><a href="/about">About</a></li>
				<li className="restaurants-li navbar-link"><a href={`/restaurants/${defaultLocation}`}>Restaurants</a></li>
				{currentUser &&
					<li className="user-li">
						<div className="user-img" onClick={toggleAccountMenu}>
							<img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="" />
						</div>
						<div className="account-menu" ref={accMenuRef}>
							<h2>{currentUser}</h2>
							<ul>
								<li className="logout-li" onClick={handleLogout}>Logout</li>
							</ul>
						</div>
						<div className="account-menu-triangle"></div>
					</li>}
			</ul>
		</div >
	)
}
