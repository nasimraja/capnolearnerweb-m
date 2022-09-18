import React, { Component,useState,useEffect } from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import user from '../../images/user.png'

const Signup = () => {
    return(
      <div className='login-bg'>
          <div className="wrp-login">
              <form>
                  <div className="login-content">
                      <div className="user-img">
                          <img src={user} alt="user-img" />
                      </div>
                      <div className="wrp-label">
                          <label>Full Name</label>
                          <input placeholder="Name" />
                      </div>
                      <div className="wrp-label mrt-input">
                          <label>Phone Number</label>
                          <input placeholder="Phone Number" />
                      </div>
                      <div className="wrp-label mrt-input">
                          <label>Email Address</label>
                          <input placeholder="Email" />
                      </div>
                      <div className="wrp-label mrt-input">
                          <label>Password</label>
                          <input placeholder="Password" />
                      </div>
                      <div className="wrp-checkbox">
                          <div className="checkbox-c">
                              
                              <div class="custom-radios">
                              <input type="checkbox" id="color-2" name="color" value="color-2" />
                                    <label for="color-2">
                                    <span>
                                    </span>
                                    </label>
                                </div>
                                <p>I need to agree to <span>term and condition</span></p>
                          </div>
                        
                      </div>
                      <button className="login-btn">Login</button>
                      <div className="account-content">
                          <p>Dont have an account?</p>
                          <a href="#">Login</a>
                      </div>
                  </div>
              </form>
          </div>
      </div>
    );
 

}
export default Signup;