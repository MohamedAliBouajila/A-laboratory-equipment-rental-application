const verifyToken = (req, res, next) => {
    const myS = Parse.Object.extend("_Session");
    const S = new Parse.Query(myS);
    if (req.headers && req.headers.authorization) {
        const myS = Parse.Object.extend("_Session");
        const S = new Parse.Query(myS);
        S.equalTo("sessionToken",req.headers.authorization)
        S.select("sessionToken", "user");
        S.find({sessionToken :req.headers.authorization}).then((result) => {
          let [data] = result;
          const session = data.get("sessionToken");
          const user = data.get("user");
          req.sessionToken = session;
          req.userId = user.id
          next();
        }, (error) => {
          res.status(500).json("Not Valid");
        });
      }else{
        res.status(409).json({"error":"verifiy login"});
      }
}
  module.exports = verifyToken;