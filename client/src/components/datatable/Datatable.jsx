import Swal from 'sweetalert2'
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { userRequest } from "../../services/AuthServices";
const Datatable = ({ data, columns, For }) => {
  const deleteLine = async (id) => {
    let action = {}
    switch(For){
      case("users"):
        action = {
          title: 'Do you wanna delete this user!',
          text: 'After this action all user informations and activities will be deleted',
          showCancelButton : true,
          icon: 'warning',
          confirmButtonText: 'Delete',
          confirmButtonColor:"#3085d6"
        }
      break;
      case("items"):
      action = {
        title: 'Do you wanna delete this item!',
        text: 'After this action all rents related to this item will be deleted',
        showCancelButton : true,
        icon: 'warning',
        confirmButtonText: 'Delete',
        confirmButtonColor:"#3085d6"
      }
    break;
    default:
      break;
      
    }
    Swal.fire(action).then((result)=>{
      if (result.isConfirmed) {
         userRequest.delete(`/${For}/${id}`).then((result) => {
          let warningText = For==="items"?
                            "The item under rent please make sure all items returned then delete it...":
                            "This user have items under rents please make sure that he retuned all items then delete it...";
          result.data?
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000
          }).then(()=>{
            window.location.reload(false);
          }):
          Swal.fire({
            icon: 'warning',
            title:'Verify!',
            text: warningText
          });
        });
    }})
    
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${For}/${params.row.id}`} className="link">
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => deleteLine(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="dataTableTitle">
        All {For}
        <Link to={`/${For}/new`} className="link addNewBtn">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
