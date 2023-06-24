import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import dashboard from './css/main.module.css'


const PostForm = (props) => {
    const navigate = useNavigate()
    const {allPosts, setAllPosts} = props
    const [errors, setErrors] = useState({})
    const [description, setDescription] = useState()
    const [image, setImage] = useState('')

    const fileSelectedHandler = (event) => {
        const file = event.target.files[0]
        const data = new FormData()
        data.append('file', file)
        data.append("upload_preset", "Hive_Media")
        axios.post('https://api.cloudinary.com/v1_1/disq3dfbj/image/upload', data)
        .then(res => {
            console.log(res)
            setImage(res.data.secure_url)
        })
        .catch(err => console.log(err))


    }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/post/create', {description, image}, {withCredentials:true})
            .then((res) => {
                console.log(res);
                setAllPosts([...allPosts, res.data])
                navigate('/dashboard')
            })
            .catch((err) => {
                console.log("Failed to create post")
                console.log(err);
                if(!err.response.data.verified){
                    setErrors(err.response.data.errors)
                }
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
                            <a href={'/myPosts'} class={dashboard.icon}>
                            <i class="uil uil-user"></i>
                                <span class={dashboard.linkName}>My posts</span>
                            </a>
                        </li>
                    <li class={dashboard.list}>
                        <a href={'/dashboard'} class={dashboard.icon}>
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
                        <i class="uil uil-plus" id={dashboard.dashIcon}></i>
                        <h1 class={dashboard.text}>Create Post</h1>
                    </div>

                    <div class={dashboard.container3}>
                        <div class={dashboard.card}>
                            <form onSubmit={submitHandler}>
                                    <div class={dashboard.sendComment}> 
                                        <input type="file" class={dashboard.input} onChange= {fileSelectedHandler} name="image" placeholder='Upload Image' />

                                        <input type="text" class={dashboard.input} onChange= {(e) => {setDescription(e.target.value)}} name="description" placeholder='What will your post be about?' />
                                        <button class={dashboard.button1}>Send</button>
                                    </div>
                                    {
                                        errors.description?
                                        <p class={dashboard.error}>{errors.description.message}</p>:null
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

export default PostForm