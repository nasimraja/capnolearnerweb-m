import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import edit from '../../images/edit.png'
import checks from '../../images/checks.png'
import Delete from '../../images/delete.png';
import closeicon from '../../images/closeicon.png';
import view from '../../images/eye.png';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Editgroup = () => {

    const accessToken = localStorage.getItem('accessToken');
    const selectedTrainer = localStorage.getItem('selectedTrainer');
    const [clients, setinclients] = useState([]);
    const [data, setData] = useState([]);
    const [itemId, setItemId] = useState(null);
    const userId = localStorage.getItem('user_id');
    let _userId = localStorage.getItem('user_id');
    let _trainer = false;
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);
    const classes = useStyles();

    useEffect(() => {
        getGroups();

        const interval = setInterval(()=>{
            getGroups();
        },3000);
        return()=> clearInterval(interval);

    }, []);


    const deleteGroup = () => {
        let id = itemId ; 
        fetch(API_URL+"/group/delete/" + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                getGroups();
                setdeleteModal(!deleteModal)
                
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }



        })

    }

    const getGroups = () => {



        fetch(API_URL+"/clients?user_id=" + selectedTrainer + "&trainer=" + _trainer + "&user_type=4",

            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }

        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    console.warn("result", resp);
                    let _temp = [];
                    resp.clients.map((v, i) => {
                        _temp.push({
                            name: v.firstname,
                            status: v.status == 1 ? "Active" : "Inactive",
                            action: <p> 
{/*                                 
                                <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Edit" placement="top"><a href={"/edit/group/information/" + v.id} className="downloadimg" ><img src={edit} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Inactive" placement="top"><a href='#' className="downloadimg"><img src={checks} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Delete" placement="top"><a  onClick={() => openItemPopUp(v.id)}  className="downloadimg"><img src={Delete} /></a></Tooltip>  */}
                                <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href={"/view/group/information/" + v.id} className="downloadimg" ><img src={view} /></a></Tooltip>
                              </p>
                        })
                    })
                    setData(_temp);


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

    const openItemPopUp = (id) => {
        setItemId(id);
        setdeleteModal(!deleteModal)
    } 

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }



    const columns = [
        {
            title: "Name", field: "name"
        },
        {
            title: "Status", field: "status"
        },
        {
            title: <span className="text-right">Actions</span>, field: "action",align: "right"
        }
    ]


    return (
        <div className="">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="head-demoreport">
                        <h3>Groups</h3>
                        <div className="back-icon-wrp">
                            <Link to="/viewcreate" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>

                    <div className="wrp-bankform">
                        <div style={{ maxWidth: '100%' }}>
                            <MaterialTable
                            options={{
                                search: true,
                                showTitle: false,
                                toolbar: true,
                                pageSize: (data.length > 10  ? 15 : 5),

                                pageSizeOptions:[5,10,20,50,150,200]
                            }}
                                columns={columns}
                                data={data}
                                title=""
                            />

                        </div>
                    </div>
                </div>


                <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                    <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                    <ModalBody>
                        <div className="modal-p">
                            <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                            <h4>Are You Sure?</h4>
                            <p>Do you really want to delete this record?</p>
                            <div className="wrp-delete-btn">
                                <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                                <div className="delete-btn1"><a onClick={deleteGroup}>Delete</a></div>
                            </div>
                        </div>
                    </ModalBody>

                </Modal>
            </div>

        </div>
    )
}

export default Editgroup;