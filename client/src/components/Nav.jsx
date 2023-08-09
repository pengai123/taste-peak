import React, { useRef, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { Context } from "./App.jsx"
import axios from "axios"

export default function Nav() {

  const { currentUser, setCurrentUser, defaultLocation } = useContext(Context)
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

  const handleLogout = async () => {
    try {
      const logoutUrl = process.env.NODE_ENV === 'development' ? '/api/logout' : 'https://api.tastepeak.com/api/logout'
      const { data } = await axios.get(logoutUrl)
      if (data.status === "success") {
        setCurrentUser(null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleAccountMenu = () => {
    const accountMenu = document.querySelector(".account-menu");
    accountMenu.classList.toggle("active")
  }
  useEffect(() => {
    const navbarLinks = document.querySelectorAll(".navbar ul.navbar-links > li");
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
              <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt="profile picture" />
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
