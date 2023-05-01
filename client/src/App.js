import axios from 'axios'
import Login from './components/Login'
import {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import {UserProvider} from './context/UserContext'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Registration from './components/Registration'
import PostForm from './components/PostForm'
import ViewPost from './components/ViewPost'
import EditForm from './components/EditForm'
import EditComment from './components/EditComment'
import UserPosts from './components/UserPosts'
import Profile from './components/Profile'

function App() {
  const [allPosts, setAllPosts] = useState([])
  const [allUsers, setAllUsers] = useState([])
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers}/>}/>
          <Route path='/post/create' element={<PostForm allPosts={allPosts} setAllPosts={setAllPosts}/>}/>
          <Route path='/post/view/:id' element={<ViewPost/>} />
          <Route path='/post/edit/:id' element={<EditForm/>} />
          <Route path='/comment/edit/:id' element={<EditComment/>} />
          <Route path='/myPosts' element={<UserPosts/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
