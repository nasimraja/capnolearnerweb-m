import React, { useEffect, useState } from 'react';
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

const List = () => {

    const [data,setData] = useState([]) ;
    const accessToken = localStorage.getItem('accessToken');
    const [editModal, setEditModal] = useState(false);
    const EditToggleModal = () => setEditModal(!editModal);
    const [emailList, setEmailList] = useState([]);

  



    
    const getEmailsList = (_domain) => {
        fetch(API_URL+"/get/group/list/"+_domain,
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
                    let _data = {} ;
                    let _list = [] ; 
                     resp.data.map((v,i) => {
                        _list.push(v.email);
                    })
                   

                    setEmailList(_list)
                    EditToggleModal()
                    // // console.log(_data)
                }
                else{
                // alert("no emails found")        
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


    const showList = (_list) => {
        // alert(_list);
        _list = _list.split(",") ; 
        setEmailList(_list)
        EditToggleModal()
    } 
    const getEmails = () => {
        fetch(API_URL+"/get/group/emails/",
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
                    let _data = {} ;
                    let _dataAray = [] ; 
                     resp.data.map((v,i) => {
                        _data = v ;
                        _data['price'] = v.price ? v.price : "Default" ; 
                        _data['business'] = v.business ? v.business : "NA" ; 
                        
                        let _emails = v.email ; 
                        let _emailCount = v.email.split(',');
                        _emailCount = _emailCount.length ; 
                        let _domain  = v.primaryEmail.split("@") ;
                        _data['action'] =  _emails == "all" ? <a onClick={() => getEmailsList(_domain[1])} className="downloadimg"><img src={listicon} /></a> : <a onClick={() => showList(_emails)} className="downloadimg"><img src={listicon} /></a>  ;
                        _data['email'] = v.email == "all" ? "All emails by default" : _emailCount ; 

                        _dataAray.push(_data) ; 
                    })
                    setData(_dataAray);
                    // // console.log(_data)
                }
                else{
                // alert("no emails found")        
                }
            
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })
    }

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    useEffect(() => {
        getEmails()
    },[])

    const columns =[
        {
            title: "Primary Email", field: "primaryEmail"
        },
        {
            title: "Emails Count", field: "email"
        },
        {
            title: "Business Name", field: "business"
        },
        
        {
            title: "($) Price", field: "price"
        },
        {
            title: <span className="text-right">View List</span>, field: "action"
        }
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
                    <h3>Email Listing</h3>
                </div>
                <div className="add-btn">
                    <button onClick={gotoAdd}>Add</button>
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
                        data={data}
                        title=""
                        />
                        
                    </div>
                </div>
               </div>
             </div>
             <Modal isOpen={editModal} toggle={EditToggleModal} className="connect-box" centered={true}>
                    <ModalHeader toggle={EditToggleModal}><span className="ml-1 roititle font-weight-bold">Members ({emailList.length})</span></ModalHeader>
                    <ModalBody>
                        <div className="modal-p">
                            {/* <h4>Edit</h4> */}
                            {
                                emailList.length > 0 && emailList.map((v,i) => {
                                    return (
                                        <li>{v}</li>
                                    )
                                })
                            }
                        </div>
                    </ModalBody>

                </Modal>
        </div>
    )
}

export default List;