import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import dashboard from './main.module.css'
import { userContext } from '../context/UserContext';

const Dashboard = (props) => { 
    const {allPosts, setAllPosts} = props
    const {allUsers, setAllUsers} = props
    const [comment, setComment] = useState('')
    const {loggedInUser, setLoggedInUser} = useContext(userContext)

    const reversePosts = allPosts.map(post => post).reverse();
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8000/api/post/all', {withCredentials:true})
        .then((allPosts) => {
            console.log(allPosts)
            setAllPosts(allPosts.data)
        })
        .catch((err) => {
            console.log(err)
            setAllPosts([])
            navigate('/')
        })
    }, [])

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
        <body class={dashboard.dashBody}>
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
                        <i class="uil uil-home" id={dashboard.dashIcon}></i>
                            <span class={dashboard.text}>Homepage</span>
                        </div>
                    </div>
                        {
                            reversePosts.map((post) => (
                                <div class={dashboard.container} key={post._id}>
                                    <div class={dashboard.post}>
                                    <h6 class={dashboard.username}>{post.username}</h6>
                                    <p class={dashboard.description}>{post.description}</p>
                                    {
                                post.user_id === window.localStorage.getItem('uuid')?

                                <div>
                                <Link to={`/post/edit/${post._id}`} class={dashboard.viewLink}>Edit</Link>
                                <Link to={`/post/view/${post._id}`} class={dashboard.viewLink}>View</Link>
                                <Link to={`/dashboard`} onClick={() => {deleteHandler(post._id)}} class={dashboard.viewLink}>Delete</Link>
                                </div>

                                :

                                <div>
                                <Link to={`/post/view/${post._id}`} class={dashboard.viewLink}>View</Link>
                                </div>

                            }
                                </div>
                                </div>
                            ))
                        }
                </div>
            </section>
        </body>
    )
}

export default Dashboard;