import React, { useState, useEffect, useContext} from 'react';
import MessageList from './MessageList';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import main from './css/main.module.css'
import { UserContext } from '../context/UserContext';
import Nav from './Nav'

const Dashboard = (props) => { 
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const reversePosts = allPosts.map(post => post).reverse()
    const navigate = useNavigate()

    const findUserName= (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].username
            }
        }
    }

    const findUserProfilePicture= (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].image
            }
        }
    }

    const deleteHandler = (postID) => {
        axios.delete(`http://localhost:8000/api/post/delete/${postID}`)
            .then((res) => {
                console.log("POST DELETED")
                window.location.reload(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <div>
                        <span className={main.pageTitleText}>Homepage</span>
                    </div>
                </div>
                <div className={main.bottomContent}>
                {
                        reversePosts.map((post) => (
                            <Link to={`/post/view/${post._id}`}>
                                <div className={main.container} key={post._id}>
                                    <div className={main.containerHeading}>
                                            <div className={main.usernameWithProfilePicture}>
                                                <img className={main.profilePicture} src={findUserProfilePicture(post.user_id)}/>
                                                <Link className={main.profileLink}to={`/profile/${post.user_id}`}>
                                                    <h6 className={main.username}>{findUserName(post.user_id)}</h6>
                                                </Link>
                                            </div>
                                    </div>
                                    <div className={main.containerContent}>
                                            {
                                                post.image?
                                                <div className={main.postImageContainer}>
                                                    <img className={main.postImage} src={post.image} alt="User Post"/>
                                                </div>:null
                                            }
                                        <div>
                                            
                                            <p className={main.postDescription}>{post.description}</p>
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

export default Dashboard;