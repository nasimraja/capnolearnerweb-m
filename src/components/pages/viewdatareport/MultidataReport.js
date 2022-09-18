import React from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';

const MultidataReport = () => {




    return (
        <div className="demodata-bg">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="choose-signals">
                        <p>Choose Signals</p>
                    </div>
                    <ul className="signals-list">
                        <li>
                            <div className="wrp-signal-content">
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="1" />
                                        <label for="1">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>Raw PCO2</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="2" />
                                        <label for="2" >
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>PetCO2</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="3" />
                                        <label for="3">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>Capnia Index</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="wrp-signal-content">
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="Breaths" />
                                        <label for="Breaths">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>Breaths per minute</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="Beat" />
                                        <label for="Beat" >
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>Beat to Beat Heartrate</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="RSA" />
                                        <label for="RSA">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>RSA amplitude</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="choose-signals mrt-sessions">
                        <p>Choose Sessions</p>
                    </div>
                    <ul className="signals-list">
                        <li>
                            <div className="wrp-signal-content">
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="4" />
                                        <label for="4">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>Wednesday 25 Aug 2021 - 19:47</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="5" />
                                        <label for="5" >
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>	Wednesday 25 Aug 2021 - 19:50</p>
                                    </div>
                                </div>
                                <div className="signal-c-child">
                                    <div class="custom-radios">
                                        <input type="checkbox" id="6" />
                                        <label for="6">
                                            <span className="redious">
                                            </span>
                                        </label>
                                    </div>
                                    <div className="caption-signal">
                                        <p>	Wednesday 25 Aug 2021 - 20:39</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default MultidataReport;