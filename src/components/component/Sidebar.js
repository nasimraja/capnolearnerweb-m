import React, { Component, useState, useEffect } from 'react';
import { Link, useParams, Router,NavLink } from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import sidebarmenu1 from '../images/sidebarmenu1.png'
import sidebarmenu2 from '../images/sidebarmenu2.png'
import sidebarmenu3 from '../images/sidebarmenu3.png'
import sidebarmenu4 from '../images/sidebarmenu4.png'
import sidebarmenu5 from '../images/sidebarmenu5.png'
import sidebarmenu6 from '../images/sidebarmenu6.png'
import sidebarmenu7 from '../images/sidebarmenu7.png'
import sidebarmenu8 from '../images/sidebarmenu8.png'
import sidebarmenu9 from '../images/sidebarmenu9.png'

// active img
import sidebarmenu1c from '../images/sidebarmenu1c.png'
import sidebarmenu2c from '../images/sidebarmenu2c.png'
import sidebarmenu3c from '../images/sidebarmenu3c.png'
import sidebarmenu4c from '../images/sidebarmenu4c.png'
import sidebarmenu5c from '../images/sidebarmenu5c.png'
import sidebarmenu6c from '../images/sidebarmenu6c.png'
import sidebarmenu7c from '../images/sidebarmenu7c.png'
import sidebarmenu8c from '../images/sidebarmenu8c.png'




import Multilanguage from '../component/Multilanguage'


const Sidebar = () => {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState()

  const tabArray = [
    {
      links: "/", tabDisplay: t('Create-Data-Report'), "tabimg": sidebarmenu1,"tabimg2": sidebarmenu1c
    },
    {
      links: "/view/data/report", tabDisplay: t('View-&-Edit-Data-Report'), "tabimg":sidebarmenu2,"tabimg2": sidebarmenu2c
    },
    {
      links: "/view/pdf/report", tabDisplay: t('View-PDF-Report'), "tabimg": sidebarmenu3,"tabimg2": sidebarmenu3c
    },
    {
      links: "/view/live", tabDisplay: t('View-Live-Session-Info'), "tabimg": sidebarmenu4,"tabimg2": sidebarmenu4c
    },
    {
      links: "/view/manageform", tabDisplay: t('View/Manage-Forms'), "tabimg": sidebarmenu1,"tabimg2": sidebarmenu1c
    },
    {
      links: "/viewcreate", tabDisplay: t('View-Create-Edit-Profile'), "tabimg": sidebarmenu5,"tabimg2": sidebarmenu5c
    },
    {
      links: "/section/report/assembly", tabDisplay: t('Session-Report-Assembly'), "tabimg": sidebarmenu6,"tabimg2": sidebarmenu6c
    },
    {
      links: "/recording", tabDisplay: t('Recording-by-Distributors'), "tabimg": sidebarmenu7,"tabimg2": sidebarmenu7c
    },
    {
      links: "/subscription/management", tabDisplay: t('Subscription-Management'), "tabimg": sidebarmenu8,"tabimg2": sidebarmenu8c
    },
  //   {
  //     links: "/subscribe/user", tabDisplay: t('Subscribed Users'), "tabimg": sidebarmenu8
  //   },

  // {
  //     links: "/", tabDisplay: t('Group-Subscription-Management'), "tabimg": sidebarmenu8
  //   },

  ];

  const handleActive = (index)=>{
    setActiveIndex(index)
  }

  const auth = localStorage.getItem('user_id');
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div>
      
      <div className="sidebar">
     
        <div class="header-child1 mrb-header"><h3>{t("Database-Dashboard")}</h3></div>
        <ul className="sidebar-list">
         {/* "hi" {activeIndex} */}
          {
            tabArray.map(function (v, index) {
              return (
                <li><NavLink to={v.links}  onClick={() => handleActive(index)}> {activeIndex == index ? <div className="sidebar-icon-img"><img src={v.tabimg2} /></div> : <div className="sidebar-icon-img"><img src={v.tabimg} /></div>}<p>{v.tabDisplay}</p></NavLink></li>
              )
            }

           )
          }
          
          <li>{
            auth ? <Link to="/login" onClick={logout} className="tabs"><div className="sidebar-icon-img"><img src={sidebarmenu9} /></div><p>{t('Logout')}</p></Link> : null
          }</li>


        </ul>
      </div>
    </div>
  )
}

export default Sidebar;