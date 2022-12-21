Parse.Cloud.define("addUser", async (req) => {
  let UserClass = Parse.Object.extend("_User");
  var userPointer = new UserClass();
  userPointer.id = req.params.userId;

  let query = new Parse.Query(Parse.Role);
  let role = req.params.userrole;
  if (["user", "admin", "laboworker"].includes(role)) {
    query.equalTo("name", role);
  } else {
    query.equalTo("name", "user");
  }
  query.first({ sessionToken: req.params.token }).then((u) => {
    let relation = u.relation("users");
    relation.add(userPointer);
    u.save({}, { sessionToken: req.params.token });
  });
});
