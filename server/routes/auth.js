const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const saveImage = require("../bin/saveImage");
const verifyToken = require("../routes/verifyToken");
const { setUserAcl } = require("../bin/setAcl");
//Verfiy LoggedIn
router.get("/VerfiyLoggedIn", verifyToken, (req, res) => {
  res.status(200).json(true);
});

// REGISTER
router.post("/register", verifyToken, upload.single("photo"), (req, res) => {
  const User = Parse.Object.extend("_User");
  const user = new User();
  let { role, ...data } = req.file
    ? { ...req.body, photo: saveImage(req.file, req.sessionToken) }
    : { ...req.body };
  setUserAcl(user);
  let checkRole = ["user", "admin", "laboworker"].includes(role);
  checkRole ? role : (role = "user");
  user.save({ ...data, role: role }, { sessionToken: req.sessionToken }).then(
    async (u) => {
      await Parse.Cloud.run("addUser", {
        userId: u.id,
        token: req.sessionToken,
        userrole: role,
      });
      res.status(201).json(u);
    },
    (err) => {
      res.status(500).json(err);
    }
  );
});

//LOGIN

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    await Parse.User.logIn(username, password).then(
      (user) => {
        res
          .status(200)
          .send({ userToken: user.getSessionToken(), Role: user.get("role") });
      },
      (error) => {
        res.status(401).send(error.message);
        req.session = null;
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/logout", verifyToken, (req, res) => {
  const myS = Parse.Object.extend("_Session");
  const S = new Parse.Query(myS);
  S.equalTo("sessionToken", req.sessionToken);
  S.first({ sessionToken: req.sessionToken });
  //     .then((item) => {
  //       req.sessionToken = null
  //       req.user = null
  //       res.status(200).send(item)
  //   }, (err) => {
  //   res.status(500).json(err);
  // });

  S.destroy({ sessionToken: req.sessionToken }).then(
    (succ) => {
      res.status(200).send("done");
    },
    (err) => {
      res.status(500).send("lee");
    }
  );
});

module.exports = router;
