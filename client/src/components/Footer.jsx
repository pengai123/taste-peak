import React from 'react'

export default function Footer() {
	return (
		<div className="footer-container">
			<div className="footer-content">
				<div className="section aboutus">
					{/* <h1 className="logo">LOG<span>O</span></h1> */}
					<h2>About Us</h2>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et dolore architecto eos asperiores ipsa a iure natus laborum aperiam labore.</p>
				</div>
				<div className="section quicklinks">
					<h2>Quick Links</h2>
					<ul>
						<li><a href="#">FAQ</a></li>
						<li><a href="#">Help</a></li>
						<li><a href="#">Terms of Service</a></li>
						<li><a href="#">Privacy Policy</a></li>
						<li><a href="#">Content Policies</a></li>
					</ul>
				</div>
				<div className="section contactus">
					<h2>Contact Us</h2>
					<div className="contact address">
						<i className="fas fa-map-marked-alt icon"></i>
						<p>123 fake street,<br/>City, State, 12345</p>
					</div>
					<div className="contact phone">
						<i className="fas fa-phone icon"></i>
						<p>+1 123 456 1111<br/>+1 123 456 2222</p>
					</div>
					<div className="contact email">
						<i className="far fa-envelope icon"></i>
						<p>example@email.com</p>
					</div>
				</div>
			</div>
			<p className="copyright-text">Copyright@2021 Personal Project. All Rights Reserved</p>
		</div>
	)
}
