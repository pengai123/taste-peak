import React, { useEffect } from 'react'

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
					<p>This application is a full stack project for self practice purpose. The frontend is built with react and vanilla CSS for self practice, all the components are responsive and display well on devices of all sizes. The backend is built with Node, Express and MongoDB Atlas as database. It uses JSON web token and cookie for authentication so you can actually sign up, log in and log out. Passwords are encrypted with bcrypt before being stored into database to ensure account security.</p>
					<p>Please feel free to play with this application! Thank You!</p>
					<h2>Technologies Used</h2>
					<div className="tech">
						<div className="frontend tech-sec">
							<h3>Front End</h3>
							<ul>
								<li>JavaScript</li>
								<li>React</li>
								<li>HTML5</li>
								<li>CSS3</li>
								<li>JavaScript XML (JSX)</li>
							</ul>
						</div>
						<div className="backend tech-sec">
							<h3>Back End</h3>
							<ul>
								<li>Node</li>
								<li>Express</li>
								<li>REST API</li>
								<li>MongoDB Atlas</li>
								<li>Cookie</li>
								<li>JSON Web Token</li>
							</ul>
						</div>
						<div className="other tech-sec">
							<h3>Other Technologies</h3>
							<ul>
								<li>Webpack</li>
								<li>Babel</li>
								<li>Heroku</li>
								<li>Git</li>
								<li>NPM</li>
								<li>Agile Development</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="about-me">
					<h1>About Me</h1>
					<h2>Peng Ai</h2>
					<h3 className="tittle">Software Engineer - Full Stack</h3>
					<h3 className="location"><i className="fas fa-map-marker-alt icon"></i>Phoenix, Arizona, United States</h3>
					<p>I am a 5+ years experienced software engineer in Aerospace industry, with strong passion for coding and debugging. Also I am a full stack engineer who enjoys new challenges and loves web development.</p>
					<h2>Contact Me</h2>
					<div className="social">
						<div className="contact linkedin">
							<i className="fab fa-linkedin-in icon"></i>
							<a href="https://www.linkedin.com/in/pengai" target="_blank">linkedin.com/in/pengai</a>
						</div>
						<div className="contact email">
							<i className="far fa-envelope icon"></i>
							<a href="mailto:aaaipeng@gmail.com">aaaipeng@gmail.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
