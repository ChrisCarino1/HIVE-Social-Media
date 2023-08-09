import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Nav from './Nav'
import main from './css/main.module.css'
import {Link, useParams, useNavigate} from 'react-router-dom'
import RightColumn from './RightColumn';

const ViewFollowing = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const [user, setUser] = useState({})
    const [userFollowing, setUserFollowing] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getUserFollowing/${id}`)
        .then((res) => {
            setUserFollowing(res.data)
            console.log("RES:", res)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

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

    const findUserName = (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].username
            }
        }
    }

    const findUserImage = (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].image
            }
        }
    }

    const findFollowing = (e) => {
        const followedUsers = []

        userFollowing.map((following) => {
            if(following.user_id === e){
                followedUsers.push(following)
            }
        })
        console.log("FOLLOWING USERS:", followedUsers)
        return followedUsers
    }

    return(
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <span className={main.pageTitleText}>{user.username}'s Following</span>
                </div>
                <div className={main.bottomContent}>
                    {
                                    findFollowing(user._id).map((following) => (
                                        <Link className={main.profileLink}to={`/profile/${following.followed_user_id}`}>
                                        <div className={main.container}>
                                            <div className={main.viewUserInfoContainer}>
                                                <div className={main.profileTagContainer}>
                                                    <img className={main.profilePicture} src={findUserImage(following.followed_user_id)}/>
                                                    <span className={main.text}>{findUserName(following.followed_user_id)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                    ))
                    }
                </div>
            </div>
            <div className={main.column}>
                <RightColumn/>
            </div>
        </div>
    )
}

export default ViewFollowing;