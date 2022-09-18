import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const Privateroute =()=>{
    const auth = localStorage.getItem('user_id');
    return auth?<Outlet />:<Navigate to="/login" />
}


export default Privateroute;