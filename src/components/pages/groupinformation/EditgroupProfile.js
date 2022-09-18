import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';

const EditgroupProfile = (props) => {
    const clientname = useRef();
    const serialNumber = useRef();
    
    const handleChange = () => {
        // // console.log(props.index)
        // // console.log({"device":serialNumber.current.value,"client":clientname.current.value})
       
    }


    return (
        <div>

            <div className="row">
                <div className="col-lg-6">
                    <div className="client-input">
                        <p>Client Name #{props.index}</p>
                        <input placeholder="Enter a Client Name" onChange={handleChange} disabled ref={clientname} defaultValue={props.data.name} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="client-input">
                        <p>CapnoTrainer® Serial Number</p>
                        <input placeholder="Write Serial Number" ref={serialNumber} disabled defaultValue={props.data.serialnumber} onChange={handleChange} />
                            
                        
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EditgroupProfile;