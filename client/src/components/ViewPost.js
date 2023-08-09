import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useNavigate,useParams, Link} from 'react-router-dom'
import main from './css/main.module.css'
import Nav from './Nav';
import RightColumn from './RightColumn';

const ViewPost = ({ needReload, setNeedReload, allUsers }) => {
    const loggedInUserID = window.localStorage.getItem('uuid')
    const navigate = useNavigate()
    const {id} = useParams()
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('')
    const [allComments, setAllComments] = useState([])
    const [reloadPost, setReloadPost] = useState(false)

    const deleteHandler = () => {
        axios.delete(`http://localhost:8000/api/post/delete/${id}`)
            .then((res) => {
                setNeedReload(!needReload)
                navigate('/dashboard')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const commentDeleteHandler = (comment_id) => {
        console.log("COMMENT ID TO DELETE", comment_id)
        axios.delete(`http://localhost:8000/api/deleteComment/${comment_id}`)
            .then((res) => {
                setReloadPost(!reloadPost)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const postComment = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:8000/api/postComment/${id}`, {comment}, {withCredentials:true})
            .then((res) => {
                console.log(res);
                setAllComments([...allComments, res.data])
                setComment("")
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const findUserProfilePicture = (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == id){
                return allUsers[i].image
            }
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/post/view/${id}`)
            .then((res) => {
                console.log(res);
                setPost(res.data.onePost)
                setAllComments(res.data.allCommentsOnOnePost)
                console.log("loaded")
            })
            .catch((err) => {
                console.log("Failed to connect to route")
                console.log(err);
            })
    }, [reloadPost])

    const handleLike = async (postId) => {
        const foundPost = post

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
            setReloadPost(!reloadPost)
            } catch (err) {
                console.log(err)
            }
        }
        else {
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/post/like/${postId}`, {} , {withCredentials:true});
            console.log("data", data)
            setReloadPost(!reloadPost)
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
    <div class={main.row}>
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
        <div className={main.column}>
            <Nav/>
        </div>
        <div class={main.column}>
        <div className={main.container}>
            <div className={main.containerHeading}>
                    <div className={main.containerHeading}>
                        <div className={main.usernameWithProfilePicture}>
                            <img className={main.profilePicture} src={findUserProfilePicture(post.user_id)}/>
                            <Link className={main.profileLink}to={`/profile/${post.user_id}`}>
                                <h6 className={main.username}>{post.username}</h6>
                            </Link>
                        </div>
                    </div>
            </div>
            <div className={main.containerContent}>
                    {
                        post.image?
                        <div className={main.postImageContainer}>
                            <img className={main.postImage} src={post.image} alt="User Post"/>
                        </div>:null
                    }
                    <div className={main.containerContentBottom}>
                        <p className={main.postDescription}>{post.description}</p>
                        <div className={main.postLikes} onClick={() => {handleLike(post._id)}}>
                            {post.likes?.find((like) => { return like == loggedInUserID})? <i class="icon-heart"/>:<i class="icon-heart-empty"/>}
                            <p>{post.likes?.length}</p>
                        </div>
                    </div>

                {
                    allComments? 
                    <div>
                        <hr/>
                        {
                            allComments.map((msg) => (
                                <div class={main.commentContainer} key={msg._id}>
                                    <div>
                                        <strong>{msg.username}</strong>
                                        <p>{msg.comment}</p>
                                    </div>
                                    {
                                        msg.user_id === window.localStorage.getItem('uuid')?
                                        <div><button onClick={() => {commentDeleteHandler(msg._id)}}>Delete</button></div>:
                                        null
                                    }
                                </div>
                            ))
                        }
                    </div>:null
                }
                <div className={main.commentForm}>
                    <form onSubmit={postComment}>
                        <div> 
                            <input type="text" value={comment} onChange= { (e) => setComment(e.target.value)} />
                            <button>Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
        <div className={main.column}>
            <RightColumn/>
        </div>
    </div>
)}

export default ViewPost;