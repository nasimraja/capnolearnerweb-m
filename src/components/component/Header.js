import React, { Component, useEffect, useRef, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
import { Link, useParams, Router, NavLink } from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import '../css/style.css'
// import '../css/style2.scss'
import '../css/responsive.css'
import $ from "jquery";
import sidebarmenu1 from '../images/sidebarmenu1.png'
import sidebarmenu2 from '../images/sidebarmenu2.png'
import sidebarmenu3 from '../images/sidebarmenu3.png'
import sidebarmenu4 from '../images/sidebarmenu4.png'
import sidebarmenu5 from '../images/sidebarmenu5.png'
import sidebarmenu6 from '../images/sidebarmenu6.png'
import sidebarmenu7 from '../images/sidebarmenu7.png'
import sidebarmenu8 from '../images/sidebarmenu8.png'
import sidebarmenu9 from '../images/sidebarmenu9.png'
import logo from '../images/logo.png';
import burger from '../images/burger.png';
import connect from '../images/connect.png';
import gcircle from '../images/gcircle.png';
import crosss from '../images/crosss.png';
import Multilanguage from '../component/Multilanguage'




const Header = () => {

    const { t } = useTranslation();

    useEffect(() => {
        changePickupStoreMenu();

        function changePickupStoreMenu() {

            var body = $('body'),
                mask = $('<div class="mask"></div>'),
                toggleSlideRight = document.querySelector(".toggle-slide-right"),
                slideMenuRight = document.querySelector(".slide-menu-right"),
                activeNav = '';
            ;
            $('body').append(mask);

            /* slide menu right */
            toggleSlideRight.addEventListener("click", function () {
                $('body').addClass("smr-open");
                $('.mask').fadeIn();
                activeNav = "smr-open";
            });

            /* hide active menu if close menu button is clicked */
            $(document).on('click', ".close-menu", function (el, i) {
                $('body').removeClass(activeNav);
                activeNav = "";
                $('.mask').fadeOut();
            });

        }
    }, [])

    const tabArray = [
        {
          links: "/", tabDisplay: "Create Data Report", "tabimg": sidebarmenu1
        },
        {
          links: "/view/data/report", tabDisplay: "View & Edit Data Report", "tabimg": sidebarmenu2
        },
        {
          links: "/view/pdf/report", tabDisplay: "View PDF Report", "tabimg": sidebarmenu3
        },
        {
          links: "/view/live", tabDisplay: "View Live Session Info", "tabimg": sidebarmenu4
        },
        {
          links: "/view/manageform", tabDisplay: "View/Manage Forms", "tabimg": sidebarmenu1
        },
        {
          links: "/viewcreate", tabDisplay: "View, Create, Edit Profile", "tabimg": sidebarmenu5
        },
        {
          links: "/section/report/assembly", tabDisplay: "Session Report Assembly", "tabimg": sidebarmenu6
        },
        {
          links: "/recording", tabDisplay: "Recording by Distributors", "tabimg": sidebarmenu7
        },
        {
          links: "/subscription/management", tabDisplay: "Subscription Management", "tabimg": sidebarmenu8
        },
    
    
    
      ];
    const auth = localStorage.getItem('user');
    const userType = localStorage.getItem('userType'); 
    const logout = () => {
        localStorage.clear();
        // alert("You Logout successful")
    }
    return (
        <div className="border-b">
            <div className="container-fluid">
                <div className="header-box">
                    <div className="header-c1">
                        <div className="header-child1">
                            <h3>{userType == 1 ? "Admin" :  userType == 2 ? "Trainer" : "Client" } {t("Cloud-Database-Dashboard")}</h3>
                        </div>
                    </div>

                    <div className="header-c2">
                    <div className="multi-langueage-wrp">
                        
                        </div>
                        <div className="burger-area">
                            <a href="#" className="burgers toggle-slide-right"> <img src={burger} /></a>
                        </div>
                        
                    </div>

                </div>

                <div className="menu slide-menu-right menu-list-wrp">
                    <button class="close-menu"><img src={crosss} className="img-close" /></button>
                    <ul className="sidebar-list">
                        {
                            tabArray.map(function (v, i) {
                                return (
                                    <li><NavLink to={v.links} className="close-menu" ><div className="sidebar-icon-img"><img src={v.tabimg} /></div><p>{v.tabDisplay}</p></NavLink></li>
                                )
                            }

                            )
                        }
                        <li>{
                            auth ? <Link to="/login" onClick={logout} className="tabs close-menu"><div className="sidebar-icon-img"><img src={sidebarmenu9} /></div> <p>Logout</p></Link> : null
                        }</li>


                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Header;

