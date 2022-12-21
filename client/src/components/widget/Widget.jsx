import "./widget.scss"
import { useState,useEffect } from "react"
import {userRequest} from "../../services/AuthServices"
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import PeopleIcon from '@mui/icons-material/People';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Widget =  ({type}) => {
  const [data,setData]=useState({});
  const [widgetContent,setWidgetContent]=useState([]);
  useEffect(()=>{
      switch(type){
        case "admin":
          userRequest("/statics/adminstatics").then((res)=>{
            let staticsData = res.data
            setData(staticsData)
          })
        break;
        case "user":
          userRequest("/statics/userstatics").then((res)=>{
            let staticsData = res.data
            setData(staticsData)
          })
        break;
        case "laboworker":
          userRequest("/statics/laboratorymanstatics").then((res)=>{
            let staticsData = res.data
            setData(staticsData)
          })
        break;
        default:
          break;
      } 
  },[type])

  useEffect(()=>{
    let Data = [];
    switch(type){
      case "admin":
        Data =  [{
              title:"Number Of Active Users",
              count:data["Number Of Active Users"],
              icon : (<PeopleIcon 
                  className="icon" 
                  style={{
                      color: "green",
                      backgroundColor:"rgba(156, 204, 158, 0.48)"
                  }} 
              />
              ),
          },{
              title:"Number Of Users",
              count:data["Number Of Users"],
              icon : (<PeopleIcon 
                  className="icon"
                  style={{
                      color: "gris",
                      backgroundColor:"rgba(155, 156, 155, 0.41)"
                  }}
                  />),
          }]
          break;
      case "laboworker":
        Data =  [{
              title:"Number Of Rented Items",
              count:data["Number Of Rented Items"],
              icon : (<HourglassTopIcon 
                  className="icon" 
                  style={{
                    color: "#419C45",
                    backgroundColor:"rgba(65, 156, 69, 0.45)"
                  }}
              />
              ),
          },{
              title:"Number Of Retarded Items",
              count:data["Number Of Retarded Items"],
              icon : (<HourglassEmptyIcon 
                  className="icon" 
                  style={{
                    color: "#BA370F",
                    backgroundColor:"rgba(191, 54, 12, 0.26)"
                  }}
              />
              ),
          },{
              title:"Number Of Items",
              count:data["Number Of Items"],
              icon : (<CategoryIcon 
                  className="icon" 
                  style={{
                    color: "#0478BC",
                    backgroundColor:"rgba(40, 178, 240, 0.23)"
                  }}
              />
              ),
          },{
              title:"Number Of Users",
              count:data["Number Of Users"],
              icon : (<PeopleIcon 
                  className="icon" 
                  style={{
                    color: "#273238",
                    backgroundColor:"rgba(39, 50, 56, 0.38)"
                  }}
              />
              ),
          }]
          break;
      case "user":
          Data = [{
              title:"Number Of Activity",
              count:data["Number Of Activity"],
              icon : (<AssignmentIcon 
                  className="icon" 
                  style={{
                      color: "#273238",
                      backgroundColor:"rgba(39, 50, 56, 0.38)"
                  }}
              />
              ),
          },{
              title:"Number Of Retarded Items",
              count:data["Number Of Retarded Items"],
              icon : (<HourglassEmptyIcon
                  className="icon" 
                  style={{
                      color: "#BA370F",
                      backgroundColor:"rgba(191, 54, 12, 0.26)"
                  }}
              />
              ),
          },{
              title:"Number Of Items In Rent",
              count:data["Number Of Items In Rent"],
              icon : (<HourglassTopIcon 
                  className="icon" 
                  style={{
                      color: "#419C45",
                      backgroundColor:"rgba(65, 156, 69, 0.45)"
                  }}
              />
              ),
          },{
              title:"Number Of Requests",
              count:data["Number Of Requests"],
              icon : (<PendingActionsIcon 
                  className="icon" 
                  style={{
                      color: "#0478BC",
                      backgroundColor:"rgba(40, 178, 240, 0.23)"
                  }}
              />
              ),
          },{
              title:"Number Of Refuse",
              count:data["Number Of Refuse"],
              icon : (<DoDisturbIcon 
                  className="icon" 
                  style={{
                      color: "crimson",
                      backgroundColor:"rgba(255,0,0,0.2)"
                  }}
              />
              ),
          }]
          break;
      default:
          break;
  }
  setWidgetContent(Data)
  
  },[data,type])



return (
  <div className="widget-container">
    {
      widgetContent.map((item)=>(
        <div className="widget">
        <div className="left">
        <div className="title">{item.title}</div>
        <div className="counter">{item.count}</div>
        </div>
        <div className="right">
            {item.icon}
        </div>
        </div>
      ))
  }
 </div>
  )
}
export default Widget