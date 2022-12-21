import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom';
import {userRequest} from "../../services/AuthServices"
import "./single.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/NavBar"
import List from "../../components/table/Table"
import Edit from "../../components/Edit/Edit"
import { getRole } from '../../services/AuthServices';
import {userInputs,itemInputs} from '../../bin/fromSource'
const Single = ({For,id}) => {

  const [Data,setData] = useState([]);
  const [picData,setPicData] = useState([]);
  const [visible,setVisible] = useState(false);
  const [EditableData,setEditableData] = useState([]);
  const [role,setRole] = useState("")
  let location = useLocation();
  let Id = location.pathname.split("/")[2]
  For = For==="profile" ? "profile" : location.pathname.split("/")[1];

  useEffect(()=>{
    let role = getRole()
    setRole(role)
  },[])
useEffect(()=>{
  const getItems = async () => {
    try{
      const res = For==="profile" ? await userRequest.get("users/myprofile") : await userRequest.get(`${For}/find/${Id}`);
      const picData = res.data.photo?res.data.photo:"" ;
      setPicData(picData)
      delete res.data.photo;
      setData(res.data)
      let data = For==="items"?
           {"id":res.data.id,"item_name":res.data["Item Name"],
          "item_details":res.data["Item Details"],
          "total_initial_items":res.data["Total initial items"]} 
          : 
           {"id":res.data.id,"username":res.data["Username"],
          "name":res.data["Name"],
          "email":res.data["Email"], "phone":res.data["Phone"]} ; 

      setEditableData(data)
    }catch(e){
      console.log(e)
    }
  };
  getItems();
  },[Id,For]
)

const dt = Object.entries(Data);

    
  return (
    <div className="single">
      <Sidebar/>
      <div className="singleContainer">
        <Navbar/>
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={()=>setVisible((prev) => !prev)} >Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img 
              src={typeof(picData)=="object"?picData.url:"#"}
              alt="avatar" className="itemImg"/>
           
              <div className="details">
              <h1 className="itemTitle">{Data.Username || Data["Item Name"]}</h1>
              <div className={For==="users" && role!=="admin"?"Items userView":"Items"}>
                  {dt.map((item)=>(
                        [...item].map((i,index)=>(
                          <div className="detailItem">
                          <div className={index!==0?"itemKey":"itemValue"}>{i}</div>                           
                          </div>
                        ))   
                  ))
                  }
            </div>
              </div>
            </div>
          
          </div>
    
            {For==="users" && role==="laboworker"?<div className="right"><h1 className="title">Last Transaction</h1><List aspect={3/1} id={Id}/></div> : <div></div>}
        
            {visible ? <div className="editPopUp"><div className="close" onClick={()=>setVisible((prev) => !prev)}>X</div><Edit data={EditableData} pic={picData} inputs={For==="items"?itemInputs:userInputs}/></div> : <></>}
        </div>

          </div>
    </div>
  )
}

export default Single