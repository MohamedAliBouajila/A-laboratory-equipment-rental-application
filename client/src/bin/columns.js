export const itemColumns = [
  {field: 'id',headerName: 'ID',type: 'number',width: 120,},
    {
      field: 'item_name',
      headerName: 'Item Name',
      width: 180,
      renderCell:(params)=>{
        let photo = params.row.photo;
        let treatedPhoto = {...photo};
        return (
           <div className="cellWithImg">
            <img className="cellImg" src={treatedPhoto.url} alt="avatar"/>
            {params.row.item_name}
           </div>
          
        )
      },
    },
    {field: 'item_details',headerName: 'Item Detals',width: 350},
    {field: 'total_initial_items',headerName: 'Total initial items',width: 130},
    {field: 'available_items',headerName: 'Available items',width: 130}
 
]
export const userColumns = [
    {field: 'id',headerName: 'ID',type: 'number',width: 120,},
    {field: 'Username',headerName: 'Username',type: 'number',width: 120,},
    {
      field: 'Name',
      headerName: 'Name',
      width: 250,
      renderCell:(params)=>{
        let photo = params.row.photo;
        let treatedPhoto = {...photo};
        return (
           <div className="cellWithImg">
            <img className="cellImg" src={treatedPhoto.url} alt="avatar"/>
            {params.row.Name}
           </div>
          
        )
      },
    },
    {field: 'Phone',headerName: 'Phone',width: 100},
    {field: 'Joined as',headerName: 'Joined as',width: 130}
  ]
  
  
  