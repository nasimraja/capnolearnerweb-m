import React from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import backIcon from "../../../components/images/back.png";

const Demodatareport = () => {
    const {tab} = useParams();
    const { t } = useTranslation();

    const Demodata = [
        {
            displayDemodata: t("Single-Session")
        },
        {
            displayDemodata: t("Multi-Session")
        },
        {
            displayDemodata: t("Group-Session")
        },
        
    ]


    return(
        <div className="demodata-bg">
            <Header />
             <div className="wrp-dashbord">
                <div className="sidebar-section">
                <Sidebar />
               </div>
               <div className="right-section">
                <div className="head-demoreport">
                    <h3>{t("Demo-Data-Reports")}</h3>
                    <div className="back-icon-wrp">
                        <Link to="/" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                </div>
                <div className="wrp-r-listbox">
                    {
                        Demodata.map( function(demodata){
                            return(
                                <div className="report-list-box">
                                    <div className="report-child1">
                                        <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option1" />
                                    </div>
                                    <div className="report-child2">
                                        <a href="#">{demodata.displayDemodata}</a>
                                    </div>
                                </div>                    
                            )
                        }
                            
                        )
                    }
                </div>
               </div>
             </div>
            
        </div>
    )
}

export default Demodatareport;