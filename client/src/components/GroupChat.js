import React, {useState} from 'react'
import axios from 'axios';
import main from './css/main.module.css'

const GroupChat = (props) => {

    const allUsers = props
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isClicked, setIsClicked] = useState(false)
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]); 
    const [loading, setLoading] = useState(false);

        const { user, chats, setChats } = useState({})

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

        const handleSubmit = async () => {
            if (!groupChatName || !selectedUsers) {
                return;
            }
        
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/users/chats/groups`,
                {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                { withCredentials: true }
            );
            setChats([data, ...chats]);
            } catch (err) {
                console.log(err)
            }

        }
        const handleGroup = (userToAdd) => {
            if (selectedUsers.includes(userToAdd)) {
                return setSelectedUsers(prevUsers => prevUsers.filter(user => user._id != userToAdd._id));
        }
            else {
                setSelectedUsers([...selectedUsers, userToAdd]);
                setSearch('')
        }
        }

    return (
        <div className={main.messageListBottom}>
            { isClicked?
                <div className={main.groupChatInputContainer}>
                    <form>
                        <div>
                            <input type="text" name="chatName" placeholder="chat name" onChange={(e) => setGroupChatName(e.target.value)}/>
                            <input placeholder="Add Users: " value={search} onChange={(e) => handleSearch(e.target.value)}/>
                            { selectedUsers.map((user) => (
                                <div className={main.messageListUserHeading} onClick={() => handleGroup(user)}>
                                    <img className={main.profilePicture} src={user.image}/>
                                    <p className={main.messageListUsername}>{user.username}</p>
                                    <p>test</p>
                                </div>
                            ))}
                            { loading ? <div>loading</div> : (searchResult?.slice(0,4).map(user => (
                                <div className={main.messageListUserHeading} onClick={() => handleGroup(user)}>
                                    <img className={main.profilePicture} src={user.image}/>
                                    <p className={main.messageListUsername}>{user.username}</p>
                                </div>
                            )))}
                            <button className={main.chatSendBtn} onClick={() => {handleSubmit()}}>Create</button>
                        </div>
                    </form>
                </div>
                
                : <button className={main.createGroupChatBtn} onClick={() => {setIsClicked(true)}}>Create Group Chat</button>
            }
        </div>
    )
    }

export default GroupChat