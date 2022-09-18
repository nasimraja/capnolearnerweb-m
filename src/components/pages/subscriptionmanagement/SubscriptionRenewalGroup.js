 
import { update } from "plotly.js";
import React, { Component, useEffect, useRef, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
  
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
 
import { Link, useParams, Router } from 'react-router-dom';
import Header from '../../component/Header';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";

const SubscriptionRenewalGroup = () =>{
    
    const { t } = useTranslation();
    const {userid} = useParams() ; 
    const accessToken = localStorage.getItem('accessToken');
    // const userId = localStorage.getItem('user_id');
    const [owner, setOwner] = useState([]);
    const [autoupdate, setAutoUpdate] = useState(0);
    const [autorenew, setAutoRenew] = useState(0);
    const [deviceLength, setDeviceLength] = useState(0);
    const [price, setPrice] = useState(0);
    
    const [messageModal, setmessageModal] = useState(false);
    const messageToggle = () => setmessageModal(!messageModal);

    const [message, setmessage] = useState(false);
    const [messageHead, setmessageHead] = useState(false);



    const [payPalModal, setPayPalModal] = useState(false);
    const payPalToggle = () => setPayPalModal(!payPalModal);

    useEffect(() => {
        getOwnerProfile();
    }, [])

    const getOwnerProfile = () => {
        fetch(API_URL+"/device/six/profile/" + userid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.log("result", resp);
                    setDeviceLength(resp.hardwareprofiles.length);
                    let _devices = resp.hardwareprofiles.length ; 
                    fetch(API_URL+"/get/group/price/" + userid,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ).then((response) => {
                    if (response.status == 200) {
                        response.json().then((resp) => {
                            // console.log("result", resp);
                            let _price = parseFloat(resp.price);
                            setPrice(_price);
                            payNow(_devices,_price)
        
                        });
                    }
                    else if (response.status == 401) {
                        logout()
                    }
                    else {
                        console.log("network error")
                    }
        
        
                }) 

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })

        fetch(API_URL+"/user/profile/" + userid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
 
                    setOwner(resp.owner[0]);

                  

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })
    }

     

    const payNow = (_deviceLength,price) => {
        $("#paypal-button-container").html('')
       
        let _price =   parseFloat(price*_deviceLength)  ; 
        _price = parseFloat(_price) ; 
        if(_price > 0){
            paypal.Buttons({
                createOrder: function(data, actions) {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: _price
                      }
                    }]
                  });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                     //   // console.log(details)
                      
                     completeRegisteration(userid,details) ; 
                       
                      })
                    },
                    onCancel: function (data) {
                       // window.location.replace("<?php echo $site_url;?>sales/CeRegister_new_back.php")
                    }
              }).render('#paypal-button-container');
        }
        
         
    }

    
   const completeRegisteration = async (id,details) => {
    

    
       const response = await fetch(API_URL+'/complete/renewal/'+id, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            id : id,
            details : JSON.stringify(details)
           }),
       })
        
       const data = await response.json()

       if(data.success){
           setmessageHead("Thank you!")
           setmessage("Your payment for renewal was successful. <br /> <br /> You will now be redirected to your cloud dashboard.") ;
           messageToggle();
         
           setTimeout(() => {
               window.location.replace('https://capnolearning.com/dashboard2')
           },10000)

       }
       else{
           setmessageHead("Error!!")
           setmessage("Some Error Occured")
           messageToggle();


       }
   }

    return(
        <div>
        <Header />
        <div className="wrp-dashbord pt-5">
            {/* <div className="sidebar-section"> */}
             {/* <Sidebar /> */}
            {/* </div> */}
            <div className="container-fluid" >
                
            <div className="row mt-5">
            <div className="col-lg-4 mt-5">
            </div>
            <div className="col-lg-4">
            
            <div className="subscription-content">
                
               <div className="notification-c">
                        <h5 className="text-center">Renew Subscription</h5>
                   <p><b>{"Account Name"}</b> {owner.firstname} {owner.lastname}.</p>
                   <p><b>{"Device(s) Registered"}</b> {deviceLength}.</p>
                   <p><b>{t('Membership-Status')}</b> {owner.status == 1 ? "Active" : "Inactive" } (<b>{t('Expiry-Date')}</b>: {owner.expire_account ? new Date(owner.expire_account*1e3).toDateString() : "NA"})</p>
               </div>
               <ul className="anual-renew-list">
                   <li><h3>{t('Annual-Renewal-Fees')}</h3></li>
                   <li><p>{ deviceLength > 0  ? "$"+parseFloat(price*(deviceLength))  : "No Device Found" }</p></li>
               </ul>
               {/* <button onClick={() => completeRegisteration(userid,"ttryt")} >NI</button> */}
               <div id="paypal-button-container" className="mt-4">
                       
                       </div>
           </div>
           
            </div>
            <div className="col-lg-4 mt-5">
            </div>
           
            </div>
           
            </div>
        </div>


        <Modal isOpen={messageModal} toggle={messageToggle} className="connect-box" centered={true}>
                <ModalHeader toggle={messageToggle}><span className="ml-1 roititle font-weight-bold">{messageHead}</span></ModalHeader>
                <ModalBody>
                    <div dangerouslySetInnerHTML={{__html : message}}>
                       
                    </div>
                </ModalBody>

            </Modal>
            
     </div>
    )
}

export default SubscriptionRenewalGroup;