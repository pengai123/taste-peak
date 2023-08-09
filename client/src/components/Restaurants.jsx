import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import RestaurantCard from "./RestaurantCard.jsx"
import Loader from "./Loader.jsx"
import { Context } from './App.jsx';

export default function Restaurants({ match }) {
  const pageSize = 20
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { defaultLocation, restaurants, setRestaurants } = useContext(Context)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPage = Math.ceil(restaurants.length / pageSize)
  const display = restaurants.slice((currentPage - 1) * pageSize, currentPage * pageSize)


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

  const search = async (loc = defaultLocation, kw = "") => {
    setIsLoading(true);
    try {
      const restaurantUrl = process.env.NODE_ENV === 'development' ? `/api/restaurants/${loc}?kw=${kw}` : `https://api.tastepeak.com/api/restaurants/${loc}?kw=${kw}`
      const { data } = await axios.get(restaurantUrl)
      if (data.length > 0) {
        setRestaurants(data)
        setLocation(data[0]?.address?.city)
      }
      setKeyword(kw)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const nextPage = e => {
    e.preventDefault();
    if (totalPage > currentPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = e => {
    e.preventDefault();
    if (currentPage - 1 > 0) {
      setCurrentPage((prev) => prev - 1)
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
            <input type="text" placeholder="Cuisine" className="keyword-input"
              value={keyword} onChange={e => setKeyword(e.target.value)} />
            <i className="fas fa-search keyword-input-icon"></i>
          </div>
          <a href={getHref()}>Search</a>
        </div>
        <div className="search-result">
          <p className="result-text">{restaurants.length} results found for <span>{match.params.keyword}</span> restaurants in <span>{match.params.location ? match.params.location : location}</span>:</p>
          <div className="restaurants-container">
            {display.map((restaurant, idx) => <RestaurantCard restaurant={restaurant} key={idx} />)}
          </div>
          <div className="page-btns">
            <button className="prev-btn page-btn" onClick={prevPage}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="page-index">Page {currentPage}</span>
            <button className="next-btn page-btn" onClick={nextPage}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  )
}
