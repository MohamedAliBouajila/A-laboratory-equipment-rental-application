import "./sidebar.scss"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import {useContext } from 'react'
import { DarkModeContext } from '../../context/darkModeContext'
import {Link} from 'react-router-dom'
import {Logout,getRole} from '../../services/AuthServices'
import { useState } from "react";
import { useEffect } from "react";
const Sidebar = () => {
  
  const handleLogout = (e)=>{
    e.preventDefault()
    Logout()
  }
  const [role,setRole] = useState("")
  useEffect(()=>{
    let role = getRole()
    setRole(role)
  },[])
  const listContent = (role)=>{
    switch(role){
      case "admin":
        return (<><Link to="/users" className="link">
        <li>
          <PersonOutlineIcon className="icon"/>
          <span>Users</span>
        </li>
        </Link></>)
        
      case "laboworker":
return (<><Link to="/items" className="link">
<li>
  <CategoryIcon className="icon"/>
  <span>Items</span>
</li>
</Link>
 <Link to="/requests" className="link">
 <li>
   <FormatListBulletedIcon className="icon"/>
   <span>Renting Requests</span>
 </li>
 </Link>
 <Link to="/rent" className="link">
 <li>
   <WorkHistoryIcon className="icon"/>
   <span>Renting Activitys</span>
 </li>
 </Link></> )
      
      case "user":
return (<>
  <Link to="/requests" className="link">
  <li>
    <FormatListBulletedIcon className="icon"/>
    <span>Renting Requests</span>
  </li>
  </Link>
  <Link to="/rent" className="link">
  <li>
    <WorkHistoryIcon className="icon"/>
    <span>Renting Activitys</span>
  </li>
  </Link></>)
       
      default:
        return (null)
    }
  }

  const {dispatch} = useContext(DarkModeContext)
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" className="link">
        <span className="logo">M3D4LI Panel</span>
        </Link>
      </div>
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" className="link">
          <li>
            <DashboardIcon className="icon"/>
            <span>Dashborad</span>
          </li>
          </Link>
          <p className="title">LISTS</p>
        {listContent(role)}
          <p className="title">USER</p>
          <Link to="/profile" className="link">
          <li>
            <AccountCircleOutlinedIcon className="icon"/>
            <span>Profile</span>
          </li>
          </Link>
          <li onClick={handleLogout}>
            <LogoutOutlinedIcon className="icon"/>
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption" onClick={()=>dispatch({type:"LIGHT"})}></div>
        <div className="colorOption" onClick={()=>dispatch({type:"DARK"})}></div>
      </div>
    </div>
  )
}

export default Sidebar