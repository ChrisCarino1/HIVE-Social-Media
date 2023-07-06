import axios from 'axios'
import io from 'socket.io-client'
import {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import {UserContext} from './context/UserContext'
import Login from './components/Login'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Registration from './components/Registration'
import PostForm from './components/PostForm'
import ViewPost from './components/ViewPost'
import EditForm from './components/EditForm'
import EditComment from './components/EditComment'
import Profile from './components/MyUserProfile'
import ViewUserProfile from './components/ViewUserProfile'
import ViewFollowers from './components/ViewFollowers'
import ViewFollowing from './components/ViewFollowing'

function App() {
  const loggedInUserID = window.localStorage.getItem('uuid')
  const [allPosts, setAllPosts] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loggedInUser, setLoggedInUser] = useState()

  const [socket] = useState(() => io(':8000'))
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    console.log("Running")

    socket.on('connect', () => {
      console.log("HERE")
      setIsConnected(true)
    })

    return () => {
      socket.disconnect(true)
    }
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8000/api/loggedInUser/${loggedInUserID}`)
    .then((res) => {
        setLoggedInUser(res.data.oneUser)
    })
    .catch((err) => {
        console.log("Failed to connect to route")
        console.log(err)
    })
}, [])

useEffect(() => {
  axios.get('http://localhost:8000/api/post/all', {withCredentials:true})
  .then((allPosts) => {
      console.log("ALL POSTS:", allPosts)
      setAllPosts(allPosts.data)
  })
  .catch((err) => {
      console.log(err)
      setAllPosts([])
  })
}, [])

useEffect(() => {
  axios.get('http://localhost:8000/api/allUsers')
  .then((allUsers) => {
      setAllUsers(allUsers.data)
  })
  .catch((err) => {
      console.log(err)
      setAllUsers([])
  })
}, [])

  return (
    <div>
      <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>
        <Routes>
          <Route path='/' element={<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>}/>
          <Route path='/post/create' element={<PostForm allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>}/>
          <Route path='/post/view/:id' element={<ViewPost allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>} />
          <Route path='/post/edit/:id' element={<EditForm allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>} />
          <Route path='/comment/edit/:id' element={<EditComment allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>} />
          <Route path='/profile' element={<Profile allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} loggedInUserID={loggedInUserID} socket={socket}/>} />
          <Route path='/profile/:id' element={<ViewUserProfile socket={socket} loggedInUserID={loggedInUserID} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
          <Route path='/profile/view/followers/:id' element={<ViewFollowers allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>}/>
          <Route path='/profile/view/following/:id' element={<ViewFollowing allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} socket={socket}/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
