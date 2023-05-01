import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useNavigate,useParams, Link} from 'react-router-dom'
import dashboard from './main.module.css'

const ViewPost = (props) => {
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
                // setComment("")
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
    <body class={dashboard.body}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <nav>
                <div class={dashboard.logoName}>
                    <div class={dashboard.logoImage}>
                        <span class={dashboard.logo_name}>HIVE</span>
                    </div>
                </div>
                <div class={dashboard.menuItems}>
                    <ul class={dashboard.menuLinks}> 
                        <li class={dashboard.list}>
                            <a href={'/dashboard'} class={dashboard.icon}>
                                <i class="uil uil-estate"></i>
                                <span class={dashboard.linkName}>Home</span>
                            </a>
                        </li>
                        <li class={dashboard.list}>
                            <a href={'/profile'} class={dashboard.icon}>
                            <i class="uil uil-user"></i>
                                <span class={dashboard.linkName}>Profile</span>
                            </a>
                        </li>
                        <li class={dashboard.list}>
                            <a href={'/myPosts'} class={dashboard.icon}>
                            <i class="uil uil-comment-alt-dots"></i>
                                <span class={dashboard.linkName}>My posts</span>
                            </a>
                        </li>
                        <li class={dashboard.list}>
                            <a href={'/post/create'} class={dashboard.icon}>
                                <i class="uil uil-plus-circle"></i>
                                <span class={dashboard.linkName}>Create Post</span>
                            </a>
                        </li>
                    </ul>
                    <ul class={dashboard.logoutMod}>
                        <li class={dashboard.list}>
                            <a class={dashboard.icon}>
                                <i class="uil uil-signout"></i>
                                <span class={dashboard.linkName} onClick={logout}>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <section class={dashboard.dashboard}>
                <div class={dashboard.dashContent}>
                    <div class={dashboard.overview}>
                        <div class={dashboard.title}>
                            {/* <i class="uil uil-tachometer-fast-alt" id={dashboard.tachometer}/>
                            <span class={dashboard.text}>Thread</span> */}
                        </div>
                    </div>
                    <div class={dashboard.container}>
                        <div class={dashboard.post2}>
                            <h6 class={dashboard.username}>{post.username}</h6>
                            <p class={dashboard.description}>{post.description}</p>
                        </div>
                    </div>
                    <div class={dashboard.container2}>
                        <div class={dashboard.post2}>
                            <h6 class={dashboard.cardTitle}>All Comments:</h6>
                            {
                                allComments.length>0?
                                allComments.map((postedComment) => (
                                    <Link class={dashboard.commentLink} to={`/comment/edit/${postedComment._id}`}>
                                        <div class={dashboard.commentContainer} key={postedComment._id}>
                                        <p class={dashboard.comment}><strong>{postedComment.username}</strong>  {postedComment.comment}</p>
                                        {/* {
                                            postedComment.user_id === window.localStorage.getItem('uuid')?
                                            <button>Delete</button>:
                                            null
                                        } */}
                                    </div>
                                    </Link>
                                )):
                                null
                            }
                            <div>
                                <form onSubmit={postComment}>
                                    <div class={dashboard.sendComment}> 
                                        <input type="text" class={dashboard.input} value={comment} onChange= { (e) => setComment(e.target.value)} />
                                        <button class={dashboard.button1}>Send</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    </body>
)}

export default ViewPost;