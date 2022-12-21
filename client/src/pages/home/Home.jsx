import "./home.scss"
import React,{useState,useEffect} from "react";
import Sidebar from "../../components/sidebar/Sidebar"
import NavBar from "../../components/navbar/NavBar"
import Widget from "../../components/widget/Widget"
import {getRole} from "../../services/AuthServices"
import Table from "../../components/table/Table"
import GridView from "../../components/Grid/GridView"
const Home = () => {
  const [role,setRole] = useState("")
  useEffect(()=>{
    let role = getRole()
    setRole(role)
  },[])
  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <NavBar/>
        <div className="widgets">
            <Widget type={role}/> 
        </div>
        {role==="user" ?<GridView/>:null}
        {role==="laboworker" ?
        <div className="listContainer">
          <div className="listTitle">Latest Activites</div>
          <Table/>
        </div>:  null
        }

        {role==="admin"?
       <><div className="listContainer">
        <div className="listTitle">Welcome Admin</div>
      </div> </> : null}
       
      </div>
    </div>
  )
}

export default Home