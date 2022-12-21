import React, { useEffect,useState } from 'react'
import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/NavBar"
import Datatable from "../../components/datatable/Datatable"
import Table from "../../components/table/Table"
import DeleteIcon from '@mui/icons-material/Delete';
import {userColumns,itemColumns} from "../../bin/columns"
import {userRequest} from "../../services/AuthServices"

const List = ({type}) => {

  const [data,setData] = useState([]);
  const [filter,setFilter]=useState("")
  const [showIcon,setShowIcon]=useState(false);
    useEffect(()=>{
      const getItems = async () => {
        if(["users","items"].includes(type)){
        try{
           let res = await userRequest.get(`${type}`);
           setData(res.data)
        }catch(e){
          console.log(e)
        }
      }
      };
      getItems();
      },[type]
    )

    const handlFilters = (e) =>{
      const value = e.target.value;
      setFilter(value.toLowerCase())
      value==="Status"?
      setShowIcon(false):
      setShowIcon(true)
    }
    
    const restFilter = ()=>{
      setShowIcon((prev)=>(!prev))
      setFilter('')
      document.getElementById("optns").value = "Status"
    }



  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
      <Navbar/>
    {!["users","items"].includes(type)?
     <div className="dataTable">
      <div className="top">
      <div className="title">Rent activity</div>
      
      {["rents","myactivity"].includes(type) && <div className="filter">
        <span>Filter by status:</span>
        <select id="optns" onChange={handlFilters}>
          <option defaultValue>Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Retarded</option>
          <option>Returned</option>
        </select>
        { showIcon && <div className="deletIcon" onClick={restFilter}><DeleteIcon className='icon'/></div>}
        </div>
      }
      </div>
    <Table filter={filter}/>
    </div>
    :<Datatable data={data} For={type} columns={type==="users"?userColumns:itemColumns}/>
    }

      </div>
    </div>
  )
}

export default List