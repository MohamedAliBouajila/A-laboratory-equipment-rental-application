const router = require("express").Router();
const DateDataValiding = require("../bin/DateDataValiding");
const verifyToken = require("../routes/verifyToken");
const { setRentAcl } = require("../bin/setAcl");

router.post("/:id", verifyToken, async (req, res) => {
  const newRent = Parse.Object.extend("rent");
  const Renter = Parse.Object.extend("_User");
  const Item = Parse.Object.extend("item");
  const Session = new Parse.Query(Parse.Session);
  const renter = new Renter();
  renter.id = req.userId;
  const item = new Item();
  item.id = req.params.id;

  const passedRent = new newRent();
  const quantity = req.body.quantity;
  const query = new Parse.Query(Item);
  setRentAcl(passedRent, req.userId);
  if (DateDataValiding(req, res)) {
    query.get(req.params.id, { sessionToken: req.sessionToken }).then(
      (item) => {
        let a = item.get("available_items");
        if (quantity > 0 && quantity <= a) {
          passedRent
            .save(
              { renter, rented_item: item, ...req.body },
              { sessionToken: req.sessionToken }
            )
            .then(
              (passedRent) => {
                res.status(200).json(passedRent);
              },
              (err) => {
                res.status(406).json(err);
              }
            );
        } else {
          res.status(406).json("Verifiy Quantity");
        }
      },
      (err) => {
        res.status(406).json(err);
      }
    );
  } else {
    res.status(406).json("Verifiy Date");
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  const Rent = Parse.Object.extend("rent");
  const updateRent = new Parse.Query(Rent);

  const Item = Parse.Object.extend("item");
  const item = new Parse.Query(Item);

  const rentStatus = req.body.renting_status;
  if (rentStatus === "canceled") {
    updateRent
      .get(req.params.id, { sessionToken: req.sessionToken })
      .then((rent) => {
        rent.save(req.body, { sessionToken: req.sessionToken }).then(
          (updated) => {
            res.status(200).json(updated);
          },
          (err) => {
            res.status(500).json(err);
          }
        );
      });
    return;
  }

  try {
    if (DateDataValiding(req, res)) {
      updateRent.get(req.params.id, { sessionToken: req.sessionToken }).then(
        (rent) => {
          const rentedItemId = rent.get("rented_item").id;

          if (rentStatus === "refused") {
            rent.save(req.body, { sessionToken: req.sessionToken }).then(
              (updated) => {
                res.status(200).json(updated);
              },
              (err) => {
                res.status(500).json(err);
              }
            );
            return;
          }

          item
            .get(rentedItemId, { sessionToken: req.sessionToken })
            .then((item) => {
              const availableItems = item.get("available_items");
              if (availableItems < req.body.quantity) {
                res
                  .status(406)
                  .json(
                    `Verify quantity only ${availableItems} item available`
                  );
              } else {
                if (rentStatus === "approved") {
                  newRentedItems =
                    item.get("rented_quantity") + rent.get("quantity");
                  newAvailableItems =
                    item.get("available_items") - rent.get("quantity");
                  item
                    .save(
                      {
                        rented_quantity: newRentedItems,
                        available_items: newAvailableItems,
                      },
                      { sessionToken: req.sessionToken }
                    )
                    .then(
                      (updated) => {
                        rent
                          .save(req.body, { sessionToken: req.sessionToken })
                          .then((updated) => {
                            res.status(200).json(updated);
                          });
                      },
                      (err) => {
                        res.status(500).json(err);
                      }
                    );
                } else if (rentStatus === "returned") {
                  newRentedItems =
                    item.get("rented_quantity") - rent.get("quantity");
                  newAvailableItems =
                    item.get("available_items") + rent.get("quantity");
                  item
                    .save(
                      {
                        rented_quantity: newRentedItems,
                        available_items: newAvailableItems,
                      },
                      { sessionToken: req.sessionToken }
                    )
                    .then(
                      (updated) => {
                        rent
                          .save(req.body, { sessionToken: req.sessionToken })
                          .then(
                            (updated) => {
                              res.status(200).json(updated);
                            },
                            (err) => {
                              res.status(500).json(err);
                            }
                          );
                      },
                      (err) => {
                        res.status(500).json(err);
                      }
                    );
                }
              }
            });
        },
        (err) => {
          res.status(500).json(err);
        }
      );
    } else {
      res.status(406).json("Verify Date");
    }
  } catch (e) {
    res.status(500).json("Verify");
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const Rent = Parse.Object.extend("rent");
  const deleteRent = new Parse.Query(Rent);
  deleteRent.get(req.params.id, { sessionToken: req.sessionToken }).then(
    (rent) => {
      rent.destroy({ sessionToken: req.sessionToken }).then((deleted) => {
        res.status(200).json("rent has been deleted...");
      });
    },
    (err) => {
      res.status(500).json(err);
    }
  );
});

//GET USER RENTS
// router.get("/findall",verifyToken, async (req, res) => {
//     const Renter = Parse.Object.extend("_User");
//     const renter = new Renter();
//     renter.id = req.user.id
//     const Rent = Parse.Object.extend("rent");
//     const getUserRents = new Parse.Query(Rent);
//     const q= req.query.rentingstatus;
//     try{
//       getUserRents.equalTo("renter", renter);
//       q?getUserRents.equalTo("renting_status", q):"";
//     const UserRents = await getUserRents.find({sessionToken :req.sessionToken});
//     let rents = [];
//     UserRents.map((rent)=>{

//       let data = {
//         "id":rent.id,
//         "rent_date":rent.get("rent_date").toISOString().slice(0, 10),
//         "return_date":rent.get("return_date").toISOString().slice(0, 10),
//         "quantity":rent.get("quantity"),
//         "renting_status":rent.get("renting_status")
//       }

//       rents.push(data)
//     })
//     res.status(200).json(rents);
//     }catch{(err) => {
//     res.status(500).json(err);
//     }}
//   });

//GET ALL RENTS
router.get("/", verifyToken, async (req, res) => {
  const Rents = Parse.Object.extend("rent");
  const allRents = new Parse.Query(Rents);
  const Renter = Parse.Object.extend("_User");
  const Session = new Parse.Query(Parse.Session);
  const renter = new Renter();
  const q = req.query.rentingstatus;

  try {
    renter.id = req.userId;
    q ? allRents.equalTo("renting_status", q) : "";
    const Rents = await allRents.findAll({ sessionToken: req.sessionToken });

    let rents = [];
    Rents.map((rent) => {
      let data = {
        id: rent.id,
        rent_date: rent.get("rent_date").toISOString().slice(0, 10),
        return_date: rent.get("return_date").toISOString().slice(0, 10),
        quantity: rent.get("quantity"),
        renting_status: rent.get("renting_status"),
      };

      rents.push(data);
    });

    res.status(200).send(rents);
  } catch {
    (err) => {
      res.status(500).json(err);
    };
  }
});

//GET SINGLE RENT
router.get("/find/rent/:id", verifyToken, async (req, res) => {
  const Rents = Parse.Object.extend("rent");
  const Rent = new Parse.Query(Rents);

  Rent.get(req.params.id, { sessionToken: req.sessionToken }).then(
    (rent) => {
      let data = {
        rent_date: rent.get("rent_date").toISOString().slice(0, 10),
        return_date: rent.get("return_date").toISOString().slice(0, 10),
        quantity: rent.get("quantity"),
        renting_status: rent.get("renting_status"),
        note: rent.get("note"),
      };

      const User = Parse.Object.extend("_User");
      const query = new Parse.Query(User);

      query.get(rent.get("renter").id, { sessionToken: req.sessionToken }).then(
        (user) => {
          let userPhoto = user.get("photo");
       
          let renter = user.get("name");
          data = { ...data, renter: renter, userPhoto: userPhoto };

          const Item = Parse.Object.extend("item");
          const itemQuery = new Parse.Query(Item);
          itemQuery
            .get(rent.get("rented_item").id, { sessionToken: req.sessionToken })
            .then((item) => {
              let itemPhoto = item.get("photo");
              let itemName = item.get("item_name");
              let itemDescription = item.get("item_details");
              data = {
                ...data,
                rented_item: itemName,
                item_details: itemDescription,
                itemPhoto: itemPhoto,
              };
              res.status(200).json(data);
            });
        },
        (error) => {
          res.status(500).json(error);
        }
      );
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});

module.exports = router;
