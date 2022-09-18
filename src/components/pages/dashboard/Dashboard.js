
import React, { Component,useState,useEffect } from 'react';
import {Link,useParams} from 'react-router-dom';
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';




const Dashboard = () => {

  const {tab} = useParams();
  

    return(
        <div>
           <Header />
           <div className="wrp-dashbord">
               <div className="sidebar-section">
                <Sidebar />
               </div>
               <div className="right-section">
               <Filter />
                 
                 
               </div>
           </div>
        </div>
    )
}

export default Dashboard;