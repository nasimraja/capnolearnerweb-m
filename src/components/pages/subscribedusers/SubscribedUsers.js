import React, { useEffect, useState,useRef } from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import Delete from '../../images/delete.png';
import { API_URL } from '../../../config';
import edit from '../../images/edit.png'
import listicon from '../../images/listicon.png'

import { Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';

const SubscribedUsers = () => {

    const [subscribeuser,setSubscribeuser] = useState([]) ;
    const expire = useRef();
    const accessToken = localStorage.getItem('accessToken');
   

  

    useEffect(() => {
        getsubscriber()
        
    },[])

    const changeExpireDay =()=>{
        let expireDate = expire.current.value;

        if(expireDate == 'all'){
            getsubscriber()
        }
        if(expireDate == 7){
            getSevendaysexpire()
        }
        if(expireDate == 30){
           getThirtydaysexpire()
        }
        
    }
 
    const getsubscriber = () => {
        fetch(API_URL+"/subscriber/user/list",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then(async (response) => {
            if (response.status == 200 ) {
                const resp = await response.json() ;
                
                let _temp = [];
                resp.result.map((v, i) => {
                    _temp.push({
                        Name: <p>{v.firstname} {v.lastname}</p>,
                        Email: v.email,
                        ExpiryDate: new Date(v.expire_account*1000).toLocaleString(),
                    })
                })
                
                setSubscribeuser(_temp);
             
            
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })
    }

    const getSevendaysexpire = () => {
        fetch(API_URL+"/exprie/next/sevendays",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then(async (response) => {
            if (response.status == 200 ) {
                const resp = await response.json() ;
                
                let _temp = [];
                resp.result.map((v, i) => {
                    _temp.push({
                        Name: <p>{v.firstname} {v.lastname}</p>,
                        Email: v.email,
                        ExpiryDate: new Date(v.expire_account*1000).toLocaleString(),
                    })
                })
                
                setSubscribeuser(_temp);
             
            
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })
    }
    const getThirtydaysexpire = () => {
        fetch(API_URL+"/exprie/next/thirtydays",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then(async (response) => {
            if (response.status == 200 ) {
                const resp = await response.json() ;
                
                let _temp = [];
                resp.result.map((v, i) => {
                    _temp.push({
                        Name: <p>{v.firstname} {v.lastname}</p>,
                        Email: v.email,
                        ExpiryDate: new Date(v.expire_account*1000).toLocaleString(),
                    })
                })
                
                setSubscribeuser(_temp);
             
            
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })
    }

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    

    const columns =[
        {
            title: "Name", field: "Name"
        },
        {
            title: "Email", field: "Email"
        },
        {
            title: "Expiry Date", field: "ExpiryDate"
        },
        
      
    ]

    const gotoAdd = () => {
        window.location.href = "/add/list"
    }

    return(
        <div className="">
            <Header />
             <div className="wrp-dashbord">
                <div className="sidebar-section">
                <Sidebar />
               </div>
               <div className="right-section">
                <div className="add-btn-wrp">
                <div className="head-listing">
                    <h3>Subscribed Users Listing</h3>
                </div>
                <div className="add-btn">
                    <div className="expridate-filter">
                        <select onChange={changeExpireDay} ref={expire}>
                            <option value="all">Expired Accounts</option>
                            <option value="7">Expiring in 7 days</option>
                            <option value="30">Expiring in 30 days</option>
                        </select>
                    </div>
                </div>
                </div>
                <div className="wrp-bankform">
                    <div style={{ maxWidth: '100%' }}>
                       
                        <MaterialTable
                        options={{
                            search: true,
                            showTitle: false,
                            toolbar: true,
                         
                            pageSize: 15,

                                pageSizeOptions:[5,10,15,20]
                         
                        }}
                        columns={columns}
                        data={subscribeuser}
                        title=""
                        />
                        
                    </div>
                </div>
               </div>
             </div>
           
        </div>
    )
}

export default SubscribedUsers;