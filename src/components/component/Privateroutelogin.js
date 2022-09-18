import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const Privateroutelogin =()=>{
    const auth = localStorage.getItem('user_id');
    return !auth ?<Outlet />:<Navigate to="/" />
}


export default Privateroutelogin;