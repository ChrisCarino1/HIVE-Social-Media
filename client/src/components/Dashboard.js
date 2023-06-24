import React, { useState, useEffect, useContext} from 'react';
import MessageList from './MessageList';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import main from './css/main.module.css'
import { UserContext } from '../context/UserContext';
import Nav from './Nav'

const Dashboard = (props) => { 
    const {allPosts, setAllPosts, allUsers, setAllUsers, socket} = props
    const [loggedInUser, setLoggedInUser] = useState({})
    const reversePosts = allPosts.map(post => post).reverse()
    const navigate = useNavigate()
    const id = window.localStorage.getItem('uuid')

    useEffect(() => {
        axios.get('http://localhost:8000/api/post/all', {withCredentials:true})
        .then((allPosts) => {
            console.log("ALL POSTS:", allPosts)
            setAllPosts(allPosts.data)
        })
        .catch((err) => {
            console.log(err)
            setAllPosts([])
            navigate('/')
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
        .then((res) => {
            setLoggedInUser(res.data.oneUser)
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
            setAllUsers(allUsers.data)
        })
        .catch((err) => {
            console.log(err)
            setAllUsers([])
            navigate('/')
        })
    }, [])

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
        <body>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <Nav/>
            <div className={main.contentBackground}>
                <div className={main.topContent}>
                    <div className={main.pageTitleContainer}>
                        <div className={main.pageTitle}>
                            <div>
                                <span className={main.pageTitleText}>For You</span>
                            </div>
                            <div>
                                <span className={main.pageTitleText}>Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={main.bottomContent}>
                {
                        reversePosts.map((post) => (

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
                                    <div className={main.post_image_container}>
                                        {
                                            post.image?
                                            <img className={main.post_image} src={post.image} alt="User Post"/>:null
                                        }
                                    </div>
                                    <div>
                                        <p className={main.postDescription}>{post.description}</p>
                                    </div>
                                </div>
                            </div>
                            
                        ))
                    }
                </div>
            </div>
            <MessageList socket={socket} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
        </body>
    )
}

export default Dashboard;