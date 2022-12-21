module.exports = function DateDataValiding(req,res){
    const rent_date = new Date(req.body.rent_date);

    const return_date = new Date(req.body.return_date);
    const todayDate = new Date().toISOString().slice(0, 10);
    const rdate = rent_date.toISOString().slice(0, 10);

    const rentingStatus = req.body.renting_status;
     
    if(rentingStatus){
          if(!["pending","approved","refused","returned"].includes(rentingStatus.toLowerCase())){
            return 0;
          }
     }

    if(rdate  < todayDate || return_date < rent_date){
      return 0;
    }else{
        req.body.rent_date = new Date(req.body.rent_date);
        req.body.return_date = new Date(req.body.return_date);
        return req.body
    }


}