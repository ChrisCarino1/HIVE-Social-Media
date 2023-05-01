import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import dashboard from './main.module.css'

const Profile = () => { 
    const navigate = useNavigate()
    const id = window.localStorage.getItem('uuid')
    const [user, setUser] = useState({
        username: ''
    })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
            .then((res) => {
                console.log(res)
                setUser(res.data.oneUser)
                console.log("USER INFO:", user)
            })
            .catch((err) => {
                console.log("Failed to connect to route")
                console.log(err);
            })
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/updateUser/${id}`, user)
            .then((res) => {
                navigate('/profile')
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const logout = () => {
        axios.post('http://localhost:8000/api/logout', {} , {withCredentials:true})
            .then((res) => {
                console.log(res);
                window.localStorage.removeItem('uuid')
                navigate('/login')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <body class={dashboard.dashBody}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <nav>
                <div class={dashboard.logoName}>
                    <div class={dashboard.logoImage}>
                        <span class={dashboard.logo_name}>HIVE</span>
                    </div>
                </div>
                <div class={dashboard.menuItems}>
                    <ul class={dashboard.menuLinks}> 
                        <li class={dashboard.list}>
                            <a href={'/dashboard'} class={dashboard.icon}>
                                <i class="uil uil-estate"></i>
                                <span class={dashboard.linkName}>Home</span>
                            </a>
                        </li>
                        <li class={dashboard.list}>
                            <a href={'/dashboard'} class={dashboard.icon}>
                            <i class="uil uil-user"></i>
                                <span class={dashboard.linkName}>My posts</span>
                            </a>
                        </li>
                        <li class={dashboard.list}>
                            <a href={'/post/create'} class={dashboard.icon}>
                                <i class="uil uil-plus-circle"></i>
                                <span class={dashboard.linkName}>Create Post</span>
                            </a>
                        </li>
                    </ul>
                    <ul class={dashboard.logoutMod}>
                        <li class={dashboard.list}>
                            <a class={dashboard.icon}>
                                <i class="uil uil-signout"></i>
                                <span class={dashboard.linkName} onClick={logout}>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <section class={dashboard.dashboard}>
                <div class={dashboard.dashContent}>
                    <div class={dashboard.overview}>
                        <div class={dashboard.title}>
                        <i class="uil uil-user" id={dashboard.dashIcon}></i>
                            <span class={dashboard.text}>{user.username}'s Profile</span>
                        </div>

                        <div class={dashboard.container}>
                            <div class={dashboard.post}>
                                <form onSubmit={submitHandler}>
                                    <div class={dashboard.sendComment}>
                                            <label for="username" class={dashboard.inputLabel}>Username:</label>
                                            <input type="text" name="username" class={dashboard.input} placeholder={user.username}/>
                                    </div>
                                    {/* <div class={dashboard.sendComment}>
                                            <label for="username" class={dashboard.inputLabel}>First Name:</label>
                                            <input type="text" name="username" class={dashboard.input} placeholder={user.firstName}/>
                                    </div>
                                    <div class={dashboard.sendComment}>
                                            <label for="username" class={dashboard.inputLabel}>Last Name:</label>
                                            <input type="text" name="username" class={dashboard.input} placeholder={user.lastName}/>
                                    </div>
                                    <div class={dashboard.sendComment}>
                                            <label for="username" class={dashboard.inputLabel}>Email:</label>
                                            <input type="text" name="username" class={dashboard.input} placeholder={user.email}/>
                                    </div>
                                    <div class={dashboard.sendComment}>
                                            <label for="username" class={dashboard.inputLabel}>Password:</label>
                                            <input type="password" name="username" class={dashboard.input} placeholder="Super secret password"/>
                                    </div> */}
                                    <button class={dashboard.button1}>Update Profile</button>
                                    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </body>
    )
}

export default Profile;