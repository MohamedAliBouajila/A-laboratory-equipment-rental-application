import "./navbar.scss"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {useContext ,useState} from 'react'
import { DarkModeContext } from '../../context/darkModeContext'
import {Link} from 'react-router-dom'
import { Logout } from "../../services/AuthServices";

const NavBar = () => {

  const {dispatch} = useContext(DarkModeContext)

  const [toggle,setToggle] = useState(false);


  return (
    <div className="navbar">
      <div className="wrapper"> 
      <div className="items">
        <div className="item">
          <div className="icon" 
          onClick={
            ()=>{
                dispatch({type:"TOGGLE"});
                setToggle(!toggle);
                }
            }>
              {toggle ? <DarkModeOutlinedIcon/> : <WbSunnyIcon/>}
          </div>
        </div>
      
      <Link to="/profile" className="link">
      <div className="item">
      <AccountCircleOutlinedIcon className="icon"/>
                <span>Profile</span>
      </div>
      </Link>
      <div className="item" onClick={Logout}>
      <LogoutOutlinedIcon className="icon"/>
      <span>Logout</span>
      </div>
      </div>
      </div>
      </div>
  )
}

export default NavBar