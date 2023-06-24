import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Nav from './Nav'
import main from './css/main.module.css'
import {Link, useParams, useNavigate} from 'react-router-dom'

const ViewFollowers = (props) => {
    const [user, setUser] = useState({})
    const [allUsers, setAllUsers] = useState()
    const [userFollowers, setUserFollowers] = useState([])
    const {id} = useParams()
    const loggedInUserID = window.localStorage.getItem('uuid')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
        .then((res) => {
            setUser(res.data.oneUser)
            console.log("USER", res.data.oneUser)
        })
        .catch((err) => {
            console.log("Failed to connect to route")
            console.log(err)
            navigate('/dashboard')
        })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/api/allUsers')
        .then((allUsers) => {
            console.log(allUsers)
            setAllUsers(allUsers.data)
        })
        .catch((err) => {
            console.log(err)
            setAllUsers([])
            navigate('/')
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getUserFollowers/${id}`)
        .then((res) => {
            setUserFollowers(res.data)
            console.log("RES:", res)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    const findUserName= (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].username
            }
        }
    }

    const findFollowers = (e) => {
        const followingUsers = []

        userFollowers.map((following) => {
            if(following.followed_user_id === e){
                followingUsers.push(following)
            }
        })
        console.log("FOLLOWING USERS:", followingUsers)
        return followingUsers
    }

    return(
        <body>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <Nav/>
            <div className={main.contentBackground}>
                <div className={main.topContent}>
                    <div className={main.pageTitle2}>
                        <img className={main.profilePicture} src={user.image}/>
                        <span className={main.text}>{user.username}</span>
                    </div>
                    <div>
                    </div>
                </div>
                <div className={main.bottomContentViewProfile}>
                <div className={main.bottomContentViewProfile}>
                            <div className={main.containerViewProfile}>
                                {
                                    findFollowers(user._id).map((follower) => (
                                        <div className={main.containerHeading}>
                                        <h2 className={main.username}>{findUserName(follower.user_id)}</h2>
                                        </div>
                                    ))
                                }
                            </div>
                </div>
                </div>
            </div>
        </body>
    )
}

export default ViewFollowers;