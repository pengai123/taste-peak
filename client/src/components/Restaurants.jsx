import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import RestaurantCard from "./RestaurantCard.jsx"
import Loader from "./Loader.jsx"
import { LocationContext } from './App.jsx';

export default function Restaurants({ match }) {
	const [location, setLocation] = useState("");
	const [keyword, setKeyword] = useState("");
	const [restaurants, setRestaurants] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [total, setTotal] = useState(0)
	const [startNumber, setStartNumber] = useState(0)
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

	const search = (loc = defaultLocation, kw = "", start = 0) => {

		setIsLoading(true);
		axios.get(`https://api.tastepeak.com/api/restaurants/${loc}?kw=${kw}&start=${start}`)
			.then(result => {
				console.log('result.data', result.data)
				setRestaurants(result.data.restaurants);
				setLocation(result.data.location.city_name);
				setTotal(result.data.total);
				setStartNumber(result.data.start);
				setKeyword(kw);
				setIsLoading(false);
			})
	}

	const nextPage = e => {
		e.preventDefault();
		if (startNumber + 20 < total) {
			search(location, keyword, startNumber + 20)
		}
	}

	const prevPage = e => {
		e.preventDefault();
		if (startNumber - 20 >= 0) {
			search(location, keyword, startNumber - 20)
		}
	}

	useEffect(() => {
		const restaurantsLink = document.querySelector(".restaurants-li")
		restaurantsLink.classList.add("active");

		search(match.params.location, match.params.keyword);
		return () => {
			restaurantsLink.classList.remove("active");
		}
	}, [])

	return (
		<div>
			<div className="page-container restaurants-page">
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
					<a href={getHref()}>Search</a>
				</div>
				<div className="search-result">
					<p className="result-text">{total} results found for <span>{match.params.keyword}</span> restaurants in <span>{match.params.location ? match.params.location : location}</span>:</p>
					<div className="restaurants-container">
						{restaurants.map((restaurant, idx) => <RestaurantCard restaurant={restaurant} key={idx} />)}
					</div>
					<div className="page-btns">
						<button className="prev-btn page-btn" onClick={prevPage}>{`< Prev`}</button>
						<span className="page-index">Page {(startNumber / 20) + 1}</span>
						<button className="next-btn page-btn" onClick={nextPage}>{`Next >`}</button>
					</div>
				</div>
			</div>
			{isLoading && <Loader />}
		</div>
	)
}
