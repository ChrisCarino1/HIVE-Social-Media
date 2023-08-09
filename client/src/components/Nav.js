import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext';
import dashboard from './css/main.module.css'

const Nav = (props) => {
    const navigate = useNavigate()
    const loggedInUserID = window.localStorage.getItem('uuid')

    const logout = () => {
        axios.post('http://localhost:8000/api/logout', {} , {withCredentials:true})
            .then((res) => {
                console.log(res);
                window.localStorage.removeItem('uuid')
                navigate('/')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <section className={dashboard.nav}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            {/* <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css" rel="stylesheet"/> */}
            <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"></link>
            <div className={dashboard.logoName}>
                <div className={dashboard.logoImage}>
                    <span className={dashboard.logo_name}>HIVE</span>
                </div>
            </div>
            <div className={dashboard.menuItems}>
                <ul className={dashboard.menuLinks}> 
                    <li className={dashboard.list}>
                        <a href={'/dashboard'} className={dashboard.icon}>
                            <i className="uil uil-estate"></i>
                            <span className={dashboard.linkName}>Home</span>
                        </a>
                    </li>
                    <li className={dashboard.list}>
                        <a href={`/profile/${loggedInUserID}`} className={dashboard.icon}>
                        <i className="uil uil-user"></i>
                            <span className={dashboard.linkName}>Profile</span>
                        </a>
                    </li>
                    <li className={dashboard.list}>
                        <a href={'/messages'} className={dashboard.icon}>
                        <i className="uil uil-envelope"></i>
                            <span className={dashboard.linkName}>Message</span>
                        </a>
                    </li>
                    <li className={dashboard.list}>
                        <a href={'/post/create'} className={dashboard.icon}>
                            <i className="uil uil-plus-circle"></i>
                            <span className={dashboard.linkName}>Post</span>
                        </a>
                    </li>
                </ul>
                <ul className={dashboard.logoutMod}>
                    <li className={dashboard.list}>
                        <a className={dashboard.icon}>
                            <i className="uil uil-signout"></i>
                            <span className={dashboard.linkName} onClick={logout}>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
)}

export default Nav;