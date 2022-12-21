const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
rule.hour = 1;

const setRetarded = schedule.scheduleJob('5 * * * * *',async () => {
  
  const Rent = Parse.Object.extend("rent");
  const allRents = new Parse.Query(Rent);

  const Rents = await allRents.find({useMasterKey:true});
  const todayDate = new Date().toISOString();   

  for (let i = 0; i < Rents.length; i++) {
    const object = Rents[i];
    const return_date = object.get("return_date")
    const renting_status = object.get("renting_status")

   if(return_date.toISOString() < todayDate && renting_status === "approved"){
    object.set("renting_status","retarded")
    object.save({useMasterKey:true}).then((done)=>{
      return;
    })
   }

  }
  });