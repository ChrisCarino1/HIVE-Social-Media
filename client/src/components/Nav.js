import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Nav = (props) => {
    const navigate = useNavigate()

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
        <nav class="navbar navbar-expand navbar-dark bg-dark" aria-label="Second navbar example">
            <div class="container-fluid">
                <a class="navbar-brand" >HIVE</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
        
                <div class="collapse navbar-collapse" id="navbarsExample02">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" to={'/dashboard'}>Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" >Link</a>
                        </li>
                    </ul>
                    <form role="search">
                    <input class="form-control" type="search" placeholder="Search" aria-label="Search"/>
                    </form>
                </div>
            </div>
        </nav>
)}

export default Nav;