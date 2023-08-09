import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import main from './css/main.module.css'
import Nav from './Nav'
import RightColumn from './RightColumn';


const PostForm = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const [errors, setErrors] = useState({})
    const [description, setDescription] = useState()
    const [image, setImage] = useState('')
    const navigate = useNavigate()

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
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <div className={main.pageTitleContainer}>
                        <span className={main.pageTitleText}>Create Post</span>
                    </div>
                </div>
                <div className={main.bottomContent}>
                    <div className={main.container}>
                        <div className={main.containerContent}>
                            <form onSubmit={submitHandler}>
                                    <div class={main.createPostGroup}> 
                                    {
                                            image?
                                            <div className={main.postImageContainer}>
                                                <img className={main.postImage} src={image} alt="User Post"/>
                                            </div>:null
                                        }
                                        <input type="file" class={main.input} onChange= {fileSelectedHandler} name="image" placeholder='Upload Image' />
                                        <input type="text" class={main.input} onChange= {(e) => {setDescription(e.target.value)}} name="description" placeholder='  What will your post be about?' />
                                        <button class={main.button1}>Upload</button>
                                    </div>
                                    {
                                        errors.description?
                                        <p class={main.error}>{errors.description.message}</p>:null
                                    }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className={main.column}>
            <RightColumn/>
            </div>
        </div>
    )
}

export default PostForm