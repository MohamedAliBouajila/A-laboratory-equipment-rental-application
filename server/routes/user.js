const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const saveImage = require('../bin/saveImage')
const verifyToken = require('../routes/verifyToken')

//UPDATE
router.put("/:id",verifyToken,upload.single("photo"), async (req, res) => {
  const User = Parse.Object.extend("_User");
  const user = new Parse.Query(User);
  user.get(req.params.id,{sessionToken: req.sessionToken}).then((user) => {
    const data = req.file ? {...req.body,"photo":saveImage(req.file,req.sessionToken)} : {...req.body} ; 
    user.save(data,{sessionToken: req.sessionToken}).then((updated) => {
      res.status(200).json(updated);
    },(error) => {
      res.status(500).json(error);
    });
    }, (error) => {
      res.status(500).send(error)
    });
});

//GET USERS

router.get("/",verifyToken, async (req, res) => {
  const Users = new Parse.Query(Parse.User);

    Users.findAll({sessionToken: req.sessionToken}).then((users)=>{
      let usersList = [];
      users.map((user)=>{
        let pic = user.get("photo");
    
        let data = {
          "id":user.id,
          "Username":user.get("username"),
          "Name":user.get("name"),
          "Phone":user.get("phone"),
          "Email":user.get("email"),
          "Joined as":user.get("createdAt").toISOString().slice(0, 10),
          "photo":pic
        }
        usersList.push(data)
      })
      
      res.status(200).json(usersList);
    },(err)=>{
      res.status(500).json({"error":"Permission denied"});
    })

});

//GET USER

router.get("/myprofile",verifyToken, async (req, res) => {
  const User = new Parse.Query(Parse.User);
  User.get(req.userId,{sessionToken: req.sessionToken}).then((user)=>{
      let photoUrl = user.get("photo");
      let data = {
        "id":user.id,
        "Username":user.get("username"),
        "Name":user.get("name"),
        "Email":user.get("email"),
        "Phone":user.get("phone"),
        "Joined as":user.get("createdAt").toISOString().slice(0, 10),
        "photo":photoUrl
      }
      res.status(200).json(data);
    },(err)=>{
      res.status(500).json({"error":"Permission denied"});
    })
});
//GET USER

router.get("/find/:id",verifyToken, async (req, res) => {
  const User = new Parse.Query(Parse.User);
  User.get(req.params.id,{sessionToken: req.sessionToken}).then((user)=>{
      let photoUrl = user.get("photo");
      let data = {
        "id":user.id,
        "Username":user.get("username"),
        "Name":user.get("name"),
        "Email":user.get("email"),
        "Phone":user.get("phone"),
        "Joined as":user.get("createdAt").toISOString().slice(0, 10),
        "photo":photoUrl
      }
      res.status(200).json(data);
    },(err)=>{
      res.status(500).json({"error":"Permission denied"});
    })

});

//DELETE USER

router.delete("/:id",verifyToken, async (req, res) => {
    const User = Parse.Object.extend("_User");
    const user = new Parse.Query(User);
    const Rent = Parse.Object.extend("rent");
    const rent = new Parse.Query(Rent);

    user.get(req.params.id, { sessionToken: req.sessionToken }).then(
        (USER) => {
          rent.equalTo("renter",USER)
          rent.findAll({sessionToken: req.sessionToken}).then((rents)=>{
            let HaveRents=false;
            rents.map((element)=> {
              if(element.get('renting_status')==="approved"){
                HaveRents=true;
              }
            })
          
            if(HaveRents){
              res.status(200).send(false);
            }else{
              Parse.Object.destroyAll(rents,{ sessionToken: req.sessionToken }).then((result)=>{
                USER.destroy({ sessionToken: req.sessionToken }).then(
                  (deleted) => {
                    res.status(200).json(true);
                  },
                  (err) => {
                    res.status(500).json(err);
                  })
              })
            }

          })
          
          
      },
      (err) => {
        res.status(500).json(err);
      }
    );
  });


module.exports = router