import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { API_URL } from "../../../config";
import Header from '../../component/Header';
import Sidebar from "../../component/Sidebar";
import { Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';



const Chooseemail = (props) => {
    const [domain,setDomain] = useState() ;
    const [emails,setEmails] = useState([]) ; 
    const [emailList,setEmailList] = useState([]) ; 
    const [showDomain, setShowDomain] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [addlist, setAddlist] = useState(false);
    const [domainFetched, setDomainFetched] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const [price,setPrice] = useState();
    
    const [messageModal, setmessageModal] = useState(false);
    const messageToggle = () => setmessageModal(!messageModal);

    const [message, setmessage] = useState(false);
    const [messageHead, setmessageHead] = useState(false);



    const showList = ()=>{
        
        // alert(currentEmail);
        if(currentEmail == "" || currentEmail == null){
            alert("Please enter/choose an email.");
            return false;
        }
        let _temp = emailList ; 
        if(_temp.includes('all')){
            alert("You have selected all emails by default.");
            return false;
        }
        setAddlist(false);


        

        if(!_temp.includes(currentEmail)){

            _temp.push(currentEmail) ; 
            setEmailList(_temp) ;
            setTimeout(() => {
                setAddlist(true);
                setCurrentEmail(null)                
            }, 500);


        }


    }
    useEffect(() =>  {
        // getEmails()
    },[emailList])

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const getList = () => {
        getEmails() ; 
    }

    const createGroup = () => {
        let _data  ;
        if(emailList.length < 2){
            alert("Please choose/add at least one member.")
            return false;
        }
        if(price == 0 || price == "" || price == null){
            alert("Please enter a valid number greater than 0.")
            return false;
        }
        let primaryEmail = emailList[0] ; 
        let _emailString = emailList.shift() ;
         _emailString =  emailList.join(",") ; 
        let typeOfEntry  = domain ? 1 : 2 ; 
        _data = [
            _emailString,
            price,
            primaryEmail,
            typeOfEntry
        ] ; 
        // emailList.map((v,i) => {
        //     _data.push([v,price,emailList[0]])
        // })
        
        fetch(API_URL+"/add/emails/" ,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
            body :  JSON.stringify(_data)
        }
    ).then(async (response) => {
        if (response.status == 201 ) {
            const resp = await response.json() ; 
            if(resp.success){
                setEmailList([]);
                setCurrentEmail(null);
                setPrice(null);
                setmessageHead("Thank you!")
                setmessage("Emails have been added to group. You will now be redirected to list page 10s.") ;
                messageToggle();
                setTimeout(() => {
                    window.location.replace('/')
                },10000)
            }
            else{
                setmessageHead("Error!")
                setmessage("Emails could not be added.") ;
                messageToggle();       
            }
        
        }
        else if (response.status == 401) {
            logout()
        }
        else {
            console.log("network error")
        }


    })
    }

    const getEmails = () => {
        if(domain == null || domain == ""){
            alert("Please enter a valid domain.");
            return false;
        }
        fetch(API_URL+"/emails/" + domain,
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
                if(resp.success){
                    setEmails(resp.data);
        setDomainFetched(true)

                }
                else{
                alert("no emails found")        
                }
            
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })
    }

    const gotoAdd = () => {
        window.location.href = "/"
    }

    return (
        <div>
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
            <div className="container">
            <div className="wrp-email-box">
            <div className="add-btn">
                    <button onClick={gotoAdd}>Go Back</button>
                </div>
                <div className="email-box">
                    <div className="radio-wrp">
                        <div className="radio-btn"><input type="radio" name="domain" onClick={ () => { setShowDomain(true); setShowEmail(false);} }  /> <span>Choose Emails using domain</span></div>
                        <div className="radio-btn"><input type="radio" name="domain" onClick={ () => { setShowEmail(true); setShowDomain(false);} } /> <span>Enter set of emails</span></div>
                    </div>

                    {
                        showDomain &&
                        
                        <div>
                             <div className="input-email">
                            <input placeholder="Enter Domain" onChange={(e) => setDomain(e.target.value)} />
                            <div className="btn-input">
                                <button onClick={getList}>Fetch</button>
                            </div>
                        </div>
                        {
                            domainFetched &&
                            <div className="select-radio-option">

                                {
                                emailList.length > 0 &&
                                <select onChange={(e) => setCurrentEmail(e.target.value)}>
                                  {
                                      emails.length == 0 ?
                                      <option>No emails found</option>
                                      :
                                      <option>Choose Email</option>
                                      
                                  }
                                  {  
                                        emailList.length > 0 &&
                                      <option value="all">All emails by default</option>

                                  }

                                  {
                                      emails.length > 0 && emails.map((v,i) => {
                                        return (
                                          <option value={v.email}>{v.email}</option>

                                        )
                                      })


                                  }
                                  
                                </select>
                                }

                                {
                                    emailList.length == 0 &&
                                    <div className="input-email">

                                     <input placeholder="Enter Email" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} />

                                    <div className="add-radio-btn"><button onClick={showList} >Add Primary Member</button></div>                                    
                                    </div>
                                }
                                {
                                     emailList.length > 0 &&
                                     <div className="add-radio-btn"><button onClick={showList} >Add Member</button></div>
                                }
                            </div>
                        }

                        </div>
                    }

                    {
                        showEmail &&
                        <div className="input-email">
                            <input placeholder="Enter Email" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} />
                            <div className="btn-input">
                            {
                                    emailList.length == 0 &&
                                    <div className="add-radio-btn"><button onClick={showList} >Add Primary Member</button></div>
                                }
                                {
                                     emailList.length > 0 &&
                                     <div className="add-radio-btn"><button onClick={showList} >Add Member</button></div>
                                }
                                {/* <button onClick={showList}>Add</button> */}
                            </div>
                        </div>
                    }
                    {
                        addlist && 
                        <div>
                            <span><u><b>Emails</b></u></span>
                            <ol className="list-radio">
                                {/* {emailList.length} */}

                                {
                                    emailList.length > 0 && emailList.map((v,i) => {
                                        return (
                                            <li>{v == "all" ? "All emails by default" : v} {i == 0 ? " - Primary Email" : null} </li>

                                        )
                                    }) 
                                }

                            </ol>
                        </div>
                    }
                    {
                                    emailList.length > 0 &&
                                    <div className="input-email mt-4">
                            <span><u><b>Price</b></u></span>

                            <input placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                            <div className="add-radio-btn"><button onClick={createGroup} >Create Group</button></div>
                                    
                                    </div>
                                    


                    }
                    
                </div>


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

export default Chooseemail;