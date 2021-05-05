import React, { useState, useContext, useEffect } from 'react'
import { LocationContext } from './App.jsx';

export default function Home() {

	const [location, setLocation] = useState("");
	const [keyword, setKeyword] = useState("");
	const { defaultLocation } = useContext(LocationContext)

	const getHref = () => {
		if (location === "" && keyword === "") {
			return `/restaurants/${defaultLocation}`
		}
		if (location === "" && keyword !== "") {
			return `/restaurants/${defaultLocation}/${keyword}`
		}
		if (location !== "" && keyword === "") {
			return `/restaurants/${location}`;
		}
		if (location !== "" && keyword !== "") {
			return `/restaurants/${location}/${keyword}`;
		}
	}

	useEffect(() => {
		const homeLink = document.querySelector(".home-li")
		homeLink.classList.add("active");
	}, [])

	return (
		<div className="home-page page-container">
			<video className="bg-video" src="/food.mp4" autoPlay muted loop playsInline></video>
			<div className="bg-overlay"></div>
			<div className="page-content">
				<h1>DISCOVER THE BEST FOOD</h1>
				<h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, quaerat eligendi? Illo.</h2>
				<div className="search-area">
					<div className="location-input-wrapper">
						<input type="text" placeholder="City" className="location-input"
							value={location} onChange={e => setLocation(e.target.value)} />
						<i className="fas fa-map-marker-alt location-input-icon"></i>
					</div>
					<div className="keyword-input-wrapper">
						<input type="text" placeholder="Restaurant, cuisine or a dish" className="keyword-input"
							value={keyword} onChange={e => setKeyword(e.target.value)} />
						<i className="fas fa-search keyword-input-icon"></i>
					</div>
					{/* <button href="/restaurants/phoenix/pizza">Search</button> */}
					<a href={getHref()}>Search</a>
				</div>
			</div>
		</div>
	)
}
