import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Nav from './Nav'
import main from './css/main.module.css'
import {Link, useParams, useNavigate} from 'react-router-dom'
import MessageList from './MessageList'

const ViewFollowers = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const [user, setUser] = useState({})
    const [userFollowers, setUserFollowers] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()

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
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <span className={main.pageTitleText}>{user.username}'s Followers</span>
                </div>
                <div className={main.bottomContent}>
                    {
                                    findFollowers(user._id).map((follower) => (
                                        <Link className={main.profileLink}to={`/profile/${follower.user_id}`}>
                                        <div className={main.container}>
                                            <div className={main.viewUserInfoContainer}>
                                                <div className={main.profileTagContainer}>
                                                    <img className={main.profilePicture} src={findUserImage(follower.user_id)}/>
                                                    <span className={main.text}>{findUserName(follower.user_id)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                    ))
                    }
                </div>
            </div>
            <div className={main.column}>
                <MessageList socket={socket} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            </div>
        </div>
    )
}

export default ViewFollowers;