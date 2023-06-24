import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useParams,useNavigate} from 'react-router-dom'
import dashboard from './css/main.module.css'

const EditComment = (props) => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const {id} = useParams()
    const [comment, setComment] = useState({
        comment: ''
    })


    useEffect(() => {
        axios.get(`http://localhost:8000/api/viewComment/${id}`, {withCredentials:true})
            .then((res) => {
                console.log("POST DATA:")
                console.log(res.data);
                setComment(res.data.oneComment)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const handleInputChange = (e) => {
            setComment({...setComment, [e.target.name]: e.target.value})
        }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/updateComment/${id}`, comment, {withCredentials:true})
            .then((res) => {
                navigate('/dashboard')
            })
            .catch((err) => {
                console.log(err);
                setErrors(err.response.data.errors);
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

    const deleteHandler = (commentID) => {
        axios.delete(`http://localhost:8000/api/deleteComment/${commentID}`)
            .then((res) => {
                console.log("COMMENT DELETED")
                navigate("/dashboard")
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
                        <i class="uil uil-arrow-up" id={dashboard.dashIcon}></i>
                        <h1 class={dashboard.text}>Update Comment</h1>
                    </div>

                    <div class={dashboard.container3}>
                        <div class={dashboard.card}>
                            <form onSubmit={submitHandler}>
                                    <div class={dashboard.sendComment}> 
                                        <input type="text" class={dashboard.input} value={comment.comment} onChange= {handleInputChange} name="comment" placeholder='What will your comment say?' />
                                        <button class={dashboard.button1}>Update</button>
                                        <div class={dashboard.div}>
                                            <button class={dashboard.button2} onClick={() => {deleteHandler(id)}}>Delete</button>
                                        </div>
                                    </div>
                                    {
                                            errors.comment?
                                            <p class={dashboard.error}>{errors.comment.message}</p>:null
                                        }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</body>
    )
}

export default EditComment;