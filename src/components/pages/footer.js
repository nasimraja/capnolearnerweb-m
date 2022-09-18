import React, { Component } from 'react';
import social1  from '../images/social1.png';
import social5  from '../images/social5.png';

class Footer extends Component {
  render() {
	 return (
		 <div className="footer-bg">
			 <div className="container">	
				<div className="row">
					<div className="col-lg-8">
						<div className="footer-content">
							<h3>Join Our<br></br>
								Community To Earn
							</h3>
						
						</div>
					</div>
					<div className="col-lg-4">
						<div className="social-wrp">
							<ul className="social-list">
								<li>
									<a href="https://t.me/metabike2" target="_blank"><img src={social1} alt="social-icon" /></a>
								</li>
								<li>
									<a href="https://t.me/Metabike1" target="_blank"><img src={social1} alt="social-icon" /></a>
								</li>
								<li>
									<a href="https://twitter.com/metabikerace" target="_blank"><img src={social5} alt="social-icon" /></a>
								</li>
								
							</ul>
						</div>
					</div>
				</div>
				<div className="white-stoke"></div>
				<div className="allright-c">
					<p>@Copyright2021</p>
				</div>
			 </div>
		 </div>

    );
  }
}

export default Footer;