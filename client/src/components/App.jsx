import React, { useState, useEffect } from 'react';
import Nav from "./Nav.jsx";
import About from "./About.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";
import Restaurants from "./Restaurants.jsx";
import PageNotFound from "./PageNotFound.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";

export const AuthContext = React.createContext();
export const LocationContext = React.createContext();

export default function App() {

	const [currentUser, setCurrentUser] = useState(undefined)
	const [fetchingUserCompleted, setFetchingUserCompleted] = useState(false)
	const [defaultLocation, setDefaultLocation] = useState("Phoenix")

	useEffect(() => {
		let currentUserApiUrl;
		if (process.env.NODE_ENV === "development") {
			currentUserApiUrl = `http://localhost:3000/api/current-user`
		} else {
			currentUserApiUrl = `https://api.tastepeak.com/api/current-user`
		}
		// axios.get("https://api.tastepeak.com/api/current-user", {withCredentials: true})
		axios.get(currentUserApiUrl, { withCredentials: true })
			.then(({ data }) => {
				console.log('user info:', data)
				setCurrentUser(data.username)
				setFetchingUserCompleted(true)
			})
			.catch(err => console.log('Error getting current user:', err))
	}, [])

	if (!fetchingUserCompleted) {
		return (<Loader />)
	}
	return (
		<div>
			<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
				<LocationContext.Provider value={{ defaultLocation, setDefaultLocation }}>
					<Router>
						<Nav />
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/login" component={Login} />
							<Route path="/signup" component={Signup} />
							<Route path="/about" component={About} />
							<Route path={["/Restaurants/:location/:keyword", "/Restaurants/:location", "/Restaurants"]} component={Restaurants} />
							<Route path="*" component={PageNotFound} />
						</Switch>
						<Footer />
					</Router>
				</LocationContext.Provider>
			</AuthContext.Provider>
		</div>
	)
}
