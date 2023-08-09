import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import main from './css/main.module.css'
import Nav from './Nav'
import RightColumn from './RightColumn';

const Dashboard = (props) => { 
    const { allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, loggedUserFollowing, setLoggedUserFollowing, socket, needReload, setNeedReload} = props
    const recentPosts = allPosts.map(post => post).reverse()
    const userIDsToFilter = loggedUserFollowing.map(data => data.followed_user_id);
    const filteredPosts = recentPosts.filter(post => userIDsToFilter.includes(post.user_id));
    const [toggleFollowingPosts, setToggleFollowingPosts] = useState(false)
    const [isActive, setIsActive] = useState(1)

    const findUserName = (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].username
            }
        }
    }

    const findUserProfilePicture = (id) => {
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

    const handleLike = async (postId) => {
        const foundPost = allPosts.find((post) => {
            return post._id == postId
        })

        const checkLike = foundPost.likes.find((like) => {
            if (like == loggedInUserID) {
                return true
            }
            return false
        })

        if (checkLike) {
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/post/unlike/${postId}`, {} , {withCredentials:true});
            console.log("data", data)
            setNeedReload(!needReload)
            } catch (err) {
                console.log(err)
            }
        }
        else {
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/post/like/${postId}`, {} , {withCredentials:true});
            console.log("data", data)
            setNeedReload(!needReload)
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <div className={main.feedButtonContainer}>
                        <span className={isActive == 1? main.feedFilterActive:main.feedFilter} onClick={() => {setToggleFollowingPosts(false); setIsActive(1)}}>For You</span>
                        <span className={main.feedFilter2}/>
                        <span className={isActive == 2? main.feedFilterActive:main.feedFilter} onClick={() => {setToggleFollowingPosts(true); setIsActive(2)}}>Following</span>
                    </div>
                </div>
                {
                    toggleFollowingPosts?
                    <div className={main.bottomContent}>
                    {
                        filteredPosts.map((post) => (
                            <div className={main.container} key={post._id}>
                                <Link to={`/post/view/${post._id}`}>
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
                                </div>
                                </Link>
                                <div className={main.containerContentBottom}>
                                    <p className={main.postDescription}>{post.description}</p>
                                    <div className={main.postLikes} onClick={() => {handleLike(post._id)}}>
                                        {post.likes.find((like) => { return like == loggedInUserID})? <i class="icon-heart"/>:<i class="icon-heart-empty"/>}
                                        <p>{post.likes.length}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                :
                <div className={main.bottomContent}>
                {
                    recentPosts.map((post) => (
                        <div className={main.container} key={post._id}>
                            <Link to={`/post/view/${post._id}`}>
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
                            </div>
                            </Link>
                            <div className={main.containerContentBottom}>
                                <p className={main.postDescription}>{post.description}</p>
                                <div className={main.postLikes} onClick={() => {handleLike(post._id)}}>
                                    {post.likes.find((like) => { return like == loggedInUserID})? <i class="icon-heart"/>:<i class="icon-heart-empty"/>}
                                    <p>{post.likes.length}</p>
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
                }
            </div>
            <div className={main.column}>
                <RightColumn/>
            </div>
        </div>
    )
}

export default Dashboard;