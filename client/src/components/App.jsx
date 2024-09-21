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

export const Context = React.createContext()

export default function App() {

  const [currentUser, setCurrentUser] = useState(undefined)
  const [fetchingUserCompleted, setFetchingUserCompleted] = useState(false)
  const [defaultLocation, setDefaultLocation] = useState("Phoenix")
  const [restaurants, setRestaurants] = useState([])

  const fetchUser = async () => {
    try {
      // const userUrl = process.env.NODE_ENV === 'development' ? '/api/current-user' : 'https://api.tastepeak.com/api/current-user'
      const userUrl = '/api/current-user'
      const { data } = await axios.get(userUrl, { withCredentials: true })
      console.log('user info:', data)
      setCurrentUser(data.username)
      setFetchingUserCompleted(true)
    } catch (error) {
      console.log('Error getting current user:', err)
      setCurrentUser(null)
      setFetchingUserCompleted(true)
    }
  }
  useEffect(() => {
    fetchUser()
  }, [])

  if (!fetchingUserCompleted) {
    return (<Loader />)
  }
  return (
    <div>
      <Context.Provider value={{ currentUser, setCurrentUser, defaultLocation, setDefaultLocation, restaurants, setRestaurants }}>
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
      </Context.Provider>
    </div>
  )
}
