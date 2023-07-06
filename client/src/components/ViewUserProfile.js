import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Nav from './Nav'
import main from './css/main.module.css'
import {Link, useParams,useNavigate} from 'react-router-dom'
import MessageList from './MessageList'

const ViewUserProfile = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, socket, loggedInUserID} = props
    const [user, setUser] = useState({})
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowing, setUserFollowing] = useState([])
    const {id} = useParams()
    const [userPosts, setUserPosts] = useState([])
    const sortedByRecentPost = userPosts.map((post) => post).reverse()
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
        axios.get(`http://localhost:8000/api/post/byUser/${id}`)
        .then((allPosts) => {
            console.log("USER POSTS:", allPosts.data)
            setUserPosts(allPosts.data)
        })
        .catch((err) => {
            console.log(err)
            navigate('/dashboard')
        })
    }, [])

    const followHandler = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/api/follow/${id}`, {loggedInUserID, id}, {withCredentials:true})
        .then((res) => {
            console.log(res)
            window.location.reload();
        })
        .catch((err) => {
            console.log("ERROR:", err)
        })
    }

    const unfollowHandler = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/api/unfollow/${id}`, {loggedInUserID, id}, {withCredentials:true})
        .then((res) => {
            console.log(res)
            window.location.reload();
        })
        .catch((err) => {
            console.log("ERROR:", err)
        })
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
        <div class={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <div>
                        <span className={main.pageTitleText}>{user.username}'s Profile</span>
                    </div>
                </div>
                <div className={main.bottomContent}>
                    <div className={main.container}>
                        <div className={main.viewUserInfoContainer}>
                            <div className={main.profileTagContainer}>
                                <img className={main.profilePicture} src={user.image}/>
                                <span className={main.text}>{user.username}</span>
                            </div>
                            <div className={main.profileTagInfo}>
                                <Link className={main.Link} to={`/profile/view/followers/${user._id}`}><p>followers {findFollowers(user._id).length}</p></Link>
                                <Link className={main.Link} to={`/profile/view/following/${user._id}`}><p>following {findFollowing(user._id).length}</p></Link>
                                {
                                    user._id == window.localStorage.getItem('uuid')? null: findFollowers(user._id).length? 
                                    <form onSubmit={unfollowHandler}><button>followed</button></form>:<form onSubmit={followHandler}><button>follow</button></form>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        sortedByRecentPost?.map((post) => (
                            <Link to={`/post/view/${post._id}`}>
                                <div className={main.container}>
                                    <div className={main.containerHeading}>
                                            <div className={main.usernameWithProfilePicture}>
                                                <img className={main.profilePicture} src={user.image}/>
                                                <h6 className={main.username}>{user.username}</h6>
                                            </div>
                                    </div>
                                    <div className={main.containerContent}>
                                        <div className={main.postImageContainer}>
                                            {
                                                post.image?
                                                <img className={main.postImage} src={post.image} alt="User Post"/>:null
                                            }
                                        </div>
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

export default ViewUserProfile;