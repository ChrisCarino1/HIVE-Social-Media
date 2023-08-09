import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios'
import main from './css/main.module.css'
import Nav from './Nav';


const MessageDashboard = (props) => {
    const {allUsers, setAllUsers, username, setUsername, loggedInUser, setLoggedInUser, socket} = props
    const [user, setUser] = useState({})
    const [search, setSearch] = useState('');
    const [userFollowers, setUserFollowers] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [chats, setChats] = useState([])
    const [groupChatName, setGroupChatName] = useState("")
    const [openSettings, setOpenSettings] = useState(false)
    const [editGCName, setEditGCName] = useState("")
    const [editGCImage, setEditGCImage] = useState("")
    const id = window.localStorage.getItem('uuid')
    const navigate = useNavigate()

    const [createMessage, setCreateMessage] = useState(false)

    const [searchResult, setSearchResult] = useState([]); 
    const [selectedUsers, setSelectedUsers] = useState([])
    const [loading, setLoading] = useState(false);

    const [isActive, setIsActive] = useState({
        status: false,
        post_id: 0
    })

    socket.on('send-message-to-all-clients', data => {
        // console.log(data)
        setMessages([...messages, data])
    })

    const handleClick = (id) => {
        setIsActive({
            status: true,
            post_id: id
        })
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
        return;
    }

    try {
        setLoading(true)
        const { data } = await axios.get(`http://localhost:8000/api/users?search=${search}`,{ withCredentials: true });
        console.log("data:", data)
        setLoading(false)
        setSearchResult(data)
    }catch (err) {
        console.log(err)
    } 
        
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
        .then((res) => {
            setUser(res.data.oneUser)
            console.log(props)
        })
        .catch((err) => {
            console.log("Failed to connect to route", err)
        })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/api/allUsers')
        .then((allUsers) => {
            console.log(allUsers)
            setAllUsers(allUsers.data)
        })
        .catch((err) => {
            console.log(err)
            setAllUsers([])
            navigate('/')
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getUserFollowers/${id}`)
        .then((res) => {
            setUserFollowers(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/chats`, { withCredentials: true })
        .then((res) => {
            setChats(res.data); 
            console.log("res:", res)
            console.log("chats:", chats)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        console.log("fetchMessages: ", fetchMessages())
    }, [selectedChat])

    const joinServer = (e) => {
        e.preventDefault()
        socket.emit('join-server', loggedInUser.username)
        }

    const accessChat = async (chat, userId) => {
        if (chat.users.length > 1) {
            setSelectedChat(chat)
        }
        else {
            try {
                const { data } = await axios.post(`http://localhost:8000/api/users/chats`, { userId }, { withCredentials: true })
                if (!chats.find((c) => c._id === data._id)) {
                    setChats([data, ...chats]);
                }
                console.log("accessChat data:", data)
                setSelectedChat(data);
                console.log("chats", chats)
                } catch (err) {
                    console.log(err)
                }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) {
            console.log("No selected chat")
            return
        }

        else{
            console.log("selectedChat:", selectedChat)
            try {
                const { data } = await axios.get(
                    `http://localhost:8000/api/messages/${selectedChat._id}`,
                    { withCredentials: true }
                    );
                    console.log("selected user id:",selectedChat._id)
                    setMessages(data);
                    console.log("messages:", messages)
            } catch (err) {
                console.log(err)
            }
        }
        };

    const sendMessage = async (e) => {
        // socket.emit("stop typing", selectedChat._id);
        if (e.key == "Enter" && newMessage) {
            try {
                console.log("newMessage", newMessage)
                console.log("selectedChat ID:", selectedChat._id)
                const { data } = await axios.post(
                    "http://localhost:8000/api/messages",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    }, { withCredentials: true }
                    );
                    // socket.emit("new message", data);
                    setNewMessage("");
                    setMessages([...messages, data]);
            } catch (err) {
                console.log("ERROR", err)
            }
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            return setSelectedUsers(prevUsers => prevUsers.filter(user => user._id != userToAdd._id));
    }
        else {
            setSelectedUsers([...selectedUsers, userToAdd]);
            setSearch('')
    }
    }

    const handleSubmit = async () => {
        if (selectedUsers.length == 1) {
            accessChat(selectedUsers[0]._id)
            setSearchResult([])
            // search('')
        }
        else {
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/users/chats/groups`,
                {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                { withCredentials: true }
            );
            console.log(data)
            setChats([data, ...chats]);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const fileSelectedHandler = (event) => {
        const file = event.target.files[0]
        const data = new FormData()
        data.append('file', file)
        data.append("upload_preset", "Hive_Media")
        axios.post('https://api.cloudinary.com/v1_1/disq3dfbj/image/upload', data)
        .then(res => {
            console.log(res)
            setEditGCImage(res.data.secure_url)
        })
        .catch(err => console.log(err))
    }
    
    const handleGroupChatName = (name, chatId) => {
        if (name == ""){
            return
        }

        axios.put(`http://localhost:8000/api/users/chats/rename`, {name, chatId}, { withCredentials: true })
            .then((res) => {
                console.log("success")
                console.log(res)
                setEditGCName("")
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleGroupChatImage = (img, chatId) => {
        if (img == ""){
            return
        }

        axios.put(`http://localhost:8000/api/users/chats/image`, {img, chatId}, { withCredentials: true })
            .then((res) => {
                console.log(res)
                setEditGCImage("")
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column1}>
                <Nav/>
            </div>
            <div className={main.column2}>
                <div className={main.topContent}>
                    {
                        openSettings?
                        <div>
                            <span className={main.pageTitleText2}>Settings</span>
                        </div>
                        :
                        <div>
                            <span className={main.pageTitleText2}>Messages</span>
                        </div>
                    }
                </div>
                <div className={main.bottomContent}>
                    {
                        openSettings?
                        <div>
                            <div className={main.messageSettingsContainer}>
                                <div className={main.settingsLabels}>
                                    <label className={main}>Group chat name</label>
                                    <label>Photo</label>
                                </div>
                                <div className={main.settingsFormControl}>
                                    <form>
                                        <div>
                                            <input type="text" onChange={(e) => {setEditGCName(e.target.value)}}/>
                                        </div>
                                    </form>
                                    <form>
                                        <div>
                                            <button for="file-input">Upload file</button>
                                            <input type="file" className={main.fileInput} id="file-input" onChange={(fileSelectedHandler)}/>
                                        </div>
                                    </form>
                                </div>
                                <div className={main.settingsSubmit}>
                                    <button onClick={() => {handleGroupChatName(editGCName, selectedChat._id); handleGroupChatImage(editGCImage, selectedChat._id)}}>Save</button>
                                </div>
                            </div>
                            <div className={main.messageSettingsContainer2}>
                                {
                                    selectedChat.users.map(() => (
                                        <div>
                                            <p>user</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        :
                        <div>
                            <div>
                                {
                                    !createMessage? <div className={main.createChatContainer}><button onClick={() => {setCreateMessage(true)}} className={main.createChatBtn2}>Create Chat</button></div>:null
                                }
                                {
                                    createMessage?
                                        <div className={main.createChatContainer}>
                                            <form className={main.createChatForm}>
                                                <div className={main.createChatDiv1}>
                                                    <input className={main.userSearchInput} placeholder="User..." value={search} onChange={(e) => handleSearch(e.target.value)}/>
                                                </div>
                                                    {
                                                        selectedUsers.length > 1? 
                                                            <div className={main.createChatDiv2}>
                                                                <input className={main.userSearchInput} type="text" name="chatName" placeholder="Chat Name" onChange={(e) => setGroupChatName(e.target.value)}/>
                                                            </div>:null
                                                    }
                                                    {
                                                        selectedUsers?
                                                            <div className={main.selectedUsersContainer}>
                                                            {
                                                                selectedUsers.map((user) => (<div className={main.selectedUser}><p>{user.username}</p></div>))
                                                            }
                                                            </div>:null
                                                    }
                                                <div class={main.createChatDiv1}>
                                                    <button className={main.createChatBtn} onClick={() => {handleSubmit()}}>Create Chat</button>
                                                </div>
                                            </form>
                                            { 
                                                loading?
                                                <div>loading</div> 
                                                : 
                                                (searchResult?.slice(0,4).map(user => (
                                                    <div className={main.messageListUserHeading2} onClick={() => handleGroup(user)}>
                                                        <img className={main.profilePicture2} src={user.image}/>
                                                        <p className={main.messageListUsername2}>{user.username}</p>
                                                    </div>
                                                )))
                                            }
                                        </div>:null
                                }
                            </div>
                            <div className={main.messageListContainer}>
                                {
                                    chats.map((chat) => (
                                        <div className={isActive.post_id == chat._id? main.chatActive:main.chat} key={chat._id} onClick={() => {handleClick(chat._id); accessChat(chat, chat.users[1]._id)}}>
                                            {
                                                chat.isGroupChat?
                                                <div>
                                                    <img className={main.profilePicture} src={chat.groupChatImage}/>
                                                    <p className={main.messageListUsername}>{chat.users.length == 2? chat.users[1].username:chat.chatName}</p>
                                                </div>
                                                :
                                                <div>
                                                    <img className={main.profilePicture} src={chat.users[1].image}/>
                                                    <p className={main.messageListUsername}>{chat.users.length == 2? chat.users[1].username:chat.chatName}</p>
                                                </div>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
                {
                    selectedChat?
            <div className={main.column3}>
                <div className={main.topContent}>
                    {
                        selectedChat.isGroupChat? 
                        <div className={main.openChatTopGC}>
                            <div className={main.one}>
                                <img className={main.profilePicture} src={selectedChat?.groupChatImage}/>
                                <p className={main.pageTitleText3}>{selectedChat?.chatName}</p>
                            </div>
                            <div className={main.two}>
                            <i class="uil uil-bars" onClick={() => setOpenSettings(!openSettings)}></i>
                            </div>
                        </div>
                        :
                        <div className={main.openChatTop}>
                            <img className={main.profilePicture} src={selectedChat?.users[1].image}/>
                            <p className={main.pageTitleText3}>{selectedChat?.users[1].username}</p>
                        </div>
                    }
                </div>
                <div className={main.messagesContainer}>
                    <div>
                        {
                            selectedChat.isGroupChat? 
                            messages.map((message) => (
                                <div className={main.messageDiv}>
                                    {message.sender._id == id? (<div className={main.loggedUserMessageDiv}><p>{message.content}</p></div>):(<div className={main.userMessageDiv}><p>{message.sender.username}</p><p>{message.content}</p></div>)}
                                </div>
                            ))
                            :
                            messages.map((message) => (
                                <div className={main.messageDiv}>
                                    {message.sender._id == id? (<div className={main.loggedUserMessageDiv}><p>{message.content}</p></div>):(<div className={main.userMessageDiv}><p>{message.sender.username}</p><p>{message.content}</p></div>)}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={main.messageInputGroup}>
                    <input className={main.chatInput} name="msg" type="text" value={newMessage} onChange={(e) => {setNewMessage(e.target.value)}} onKeyDown={(e) => {sendMessage(e)}}/>
                </div>
            </div>:null
                }
        </div>
    )
}

export default MessageDashboard