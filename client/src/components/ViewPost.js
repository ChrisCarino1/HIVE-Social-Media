import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useNavigate,useParams, Link} from 'react-router-dom'
import main from './css/main.module.css'
import Nav from './Nav';
import MessageList from './MessageList';

const ViewPost = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const navigate = useNavigate()
    const {id} = useParams()
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('')
    const [allComments, setAllComments] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/post/view/${id}`)
            .then((res) => {
                console.log(res);
                setPost(res.data.onePost)
                setAllComments(res.data.allCommentsOnOnePost)
            })
            .catch((err) => {
                console.log("Failed to connect to route")
                console.log(err);
            })
    }, [])

    const deleteHandler = () => {
        axios.delete(`http://localhost:8000/api/post/delete/${id}`)
            .then((res) => {
                navigate('/main')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const commentDeleteHandler = (comment_id) => {
        console.log("COMMENT ID TO DELETE", comment_id)
        axios.delete(`http://localhost:8000/api/deleteComment/${comment_id}`)
            .then((res) => {
                console.log(res)
                navigate(`/post/view/${id}`)
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
    <div class={main.row}>
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
        <div className={main.column}>
            <Nav/>
        </div>
        <div class={main.column}>
        <div className={main.container}>
            <div className={main.containerHeading}>
                    <div className={main.usernameWithProfilePicture}>
                        {/* <img className={main.profilePicture} src={findUserProfilePicture(post.user_id)}/> */}
                        <Link className={main.profileLink}to={`/profile/${post.user_id}`}>
                            <h6 className={main.username}>{post.username}</h6>
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
            <MessageList socket={socket} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
        </div>
    </div>
)}

export default ViewPost;