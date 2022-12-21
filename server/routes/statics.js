const router = require("express").Router();
const verifyToken = require("../routes/verifyToken");

router.get("/adminstatics", verifyToken, async (req, res) => {
  const Rent = Parse.Object.extend("rent");
  const User = Parse.Object.extend("_User");
  const rent = new Parse.Query(Rent);
  const user = new Parse.Query(User);
  let data = {};
  const setData = (result) => {
    data = { ...data, ...result };
  };

  await rent
    .distinct("renter")
    .then((res) => setData({ "Number Of Active Users": res.length }));

  await user
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Users": res?res:0 }));

  res.status(200).json(data);
});

router.get("/laboratorymanstatics", verifyToken, async (req, res) => {
  const Rent = Parse.Object.extend("rent");
  const Item = Parse.Object.extend("item");
  const User = Parse.Object.extend("_User");
  const rent = new Parse.Query(Rent);
  const item = new Parse.Query(Item);
  const user = new Parse.Query(User);

  let data = {};
  const setData = (result) => {
    data = { ...data, ...result };
  };

  const rent_first_query = rent.equalTo("renting_status", "approved");

  await rent_first_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Rented Items": res===undefined?0:res }));

  const rent_second_query = rent.equalTo("renting_status", "retarded");

  await rent_second_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Retarded Items": res===undefined?0:res }));

  await item.count({ sessionToken: req.sessionToken }).then((res) => setData({ "Number Of Items": res===undefined?0:res }));

  await user.count({ sessionToken: req.sessionToken }).then((res) => setData({ "Number Of Users": res===undefined?0:res }));

  res.status(200).json(data);
});

router.get("/userstatics", verifyToken, async (req, res) => {
  const Rent = Parse.Object.extend("rent");
  const Item = Parse.Object.extend("item");
  const User = Parse.Object.extend("_User");
  const rent = new Parse.Query(Rent);
  const item = new Parse.Query(Item);
  const user = new User();
  let data = {};
  const setData = (result) => {
    data = { ...data, ...result };
  };

  user.id = req.userId;

  const rent_first_query = rent.equalTo("renter", user);

  await rent_first_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Activity":  res===undefined?0:res }));

  const rent_second_query = rent.equalTo("renting_status", "retarded");

  await rent_second_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Retarded Items":  res===undefined?0:res}));

  const rent_thr_query = rent.equalTo("renting_status", "approved");

  await rent_thr_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Items In Rent":  res===undefined?0:res }));

  const rent_fourth_query = rent.equalTo("renting_status", "pending");

  await rent_fourth_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Requests":  res===undefined?0:res }));

  const rent_fifth_query = rent.equalTo("renting_status", "refused");

  await rent_fifth_query
    .count({ sessionToken: req.sessionToken })
    .then((res) => setData({ "Number Of Refuse":res===undefined?0:res }));

  res.status(200).json(data);
});

module.exports = router;
