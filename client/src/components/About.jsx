import React, { useEffect } from 'react'
import SkillMarquee from "./SkillMarquee.jsx"

export default function About() {

  useEffect(() => {
    const aboutLink = document.querySelector(".about-li")
    aboutLink.classList.add("active");
    return () => {
      aboutLink.classList.remove("active");
    }
  }, [])

  return (
    <div className="page-container about-page">
      <div className="about-container">
        <div className="about-app">
          <h1>About App</h1>
          <p>This is a full stack application for self practice purpose. The frontend is built with react.js and vanilla CSS, all the components are responsive and display properly on devices of all sizes. The backend is built with Node.js, Express.js and MongoDB as database. It uses JSON web token and cookie for authentication so you can actually sign up, log in and log out. Passwords are encrypted with bcrypt before being stored in database to ensure account security.</p>
          <p>Feel free to play around! Thank You!</p>
          <h3 className='tech-header'>What Are Used</h3>
          <ul className='tech'>
            <li>JavaScript</li>
            <li>React.js</li>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript XML (JSX)</li>
            <li>Node.js</li>
            <li>Express.js</li>
            <li>REST API</li>
            <li>MongoDB</li>
            <li>Cookie</li>
            <li>JWT</li>
            <li>Webpack</li>
            <li>Babel</li>
            <li>Heroku</li>
            <li>Netlify</li>
            <li>Git</li>
            <li>NPM</li>
            <li>Agile Development</li>
          </ul>
        </div>
        <div className="about-me">
          <h1>About Me</h1>
          <h2>Peng Ai</h2>
          <h3 className="tittle">Software Engineer - Full Stack</h3>
          <h3 className="location"><i className="fas fa-map-marker-alt icon"></i>Phoenix, Arizona, United States</h3>
          <p>I am a passionate and experienced full stack software engineer with a deep appreciation for both the frontend and backend aspects of web development. With a strong foundation in modern technologies and a keen eye for user-centric design, I thrive in creating seamless, responsive, and intuitive web applications.</p>
          <h2>Contact Me</h2>
          <div className="social">
            <div className="contact linkedin">
              <i className="fab fa-linkedin-in icon"></i>
              <a href="https://www.linkedin.com/in/pengai" target="_blank">linkedin.com/in/pengai</a>
            </div>
            <div className="contact email">
              <i className="far fa-envelope icon"></i>
              <a href="mailto:pengai002@gmail.com">pengai002@gmail.com</a>
            </div>
          </div>
          <h2>My Skills</h2>
          <SkillMarquee />
        </div>
      </div>
    </div>
  )
}
