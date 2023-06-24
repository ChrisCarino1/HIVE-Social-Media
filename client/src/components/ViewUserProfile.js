import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Nav from './Nav'
import main from './css/main.module.css'
import {Link, useParams,useNavigate} from 'react-router-dom'

const ViewUserProfile = (props) => {
    const [user, setUser] = useState({})
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowing, setUserFollowing] = useState([])
    const {id} = useParams()
    const [userPosts, setUserPosts] = useState([])
    const sortedByRecentPost = userPosts.map((post) => post).reverse()
    const navigate = useNavigate()
    const loggedInUserID = window.localStorage.getItem('uuid')

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
        <body>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <Nav/>
            <div className={main.contentBackground}>
                <div className={main.topContent}>
                    <div className={main.pageTitle2}>
                        <div>
                            <img className={main.profilePicture} src={user.image}/>
                            <span className={main.text}>{user.username}</span>
                        </div>
                        <div className={main.followContainer}>
                            {
                                user._id == window.localStorage.getItem('uuid')? null: findFollowers(user._id).length? 
                                <form onSubmit={unfollowHandler}><button>followed</button></form>:<form onSubmit={followHandler}><button>follow</button></form>
                            }
                            <Link to={`/profile/view/followers/${user._id}`}><p>followers {findFollowers(user._id).length}</p></Link>
                            <p>following {findFollowing(user._id).length}</p>
                        </div>
                    </div>
                </div>
                <div className={main.bottomContentViewProfile}>
                {
                        sortedByRecentPost?.map((post) => (

                            <div className={main.containerViewProfile} key={post._id}>
                                <div className={main.containerHeading}>
                                    <h2 className={main.username}>{user.username}</h2>
                                </div>
                                <div className={main.containerContent}>
                                    <div className={main.post_image_container}>
                                        {
                                            post.image?
                                            <img className={main.post_image} src={post.image} alt="User Post"/>:null
                                        }
                                    </div>
                                    <p>{post.description}</p>
                                </div>
                            </div>
                            
                        ))
                    }
                </div>
            </div>
        </body>
    )
}

export default ViewUserProfile;