const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const saveImage = require("../bin/saveImage");
const verifyToken = require("../routes/verifyToken");
const { setItemAcl } = require("../bin/setAcl");

// CREATE
router.post("/", verifyToken, upload.single("photo"), async (req, res) => {
  const Item = Parse.Object.extend("item");
  const newItem = new Item();

  const file = saveImage(req.file, req.sessionToken);
  req.body.total_initial_items = parseInt(req.body.total_initial_items);
  if (file) setItemAcl(newItem);
  newItem
    .save(
      {
        ...req.body,
        available_items: req.body.total_initial_items,
        photo: file,
      },
      { sessionToken: req.sessionToken }
    )
    .then(
      (savedItem) => {
        res.status(200).json(savedItem);
      },
      (err) => {
        res.status(500).json(err);
      }
    );
});

//UPDATE
router.put("/:id", verifyToken, upload.single("photo"), async (req, res) => {
  const Item = Parse.Object.extend("item");
  const updateItem = new Parse.Query(Item);

  updateItem.get(req.params.id, { sessionToken: req.sessionToken }).then(
    (item) => {
      req.body.total_initial_items = parseInt(req.body.total_initial_items);
      const initialItems = item.get("total_initial_items");
      const availableItems = item.get("available_items");
      const rentedQuantity = item.get("rented_quantity");
      const newInitialItems = req.body.total_initial_items;
      const newAvailableItems = Math.round(
        availableItems + (newInitialItems - initialItems)
      );

      if (newInitialItems >= rentedQuantity) {
        req.body.available_items =
          newAvailableItems < 0 ? newInitialItems : newAvailableItems;
      } else {
        req.body.total_initial_items = rentedQuantity;
        req.body.available_items = 0;
      }

      const data = req.file
        ? { ...req.body, photo: saveImage(req.file, req.sessionToken) }
        : { ...req.body };
      item.save(data, { sessionToken: req.sessionToken }).then((updated) => {
        res.status(200).json(updated);
      });
    },
    (err) => {
      res.status(500).json(err);
    }
  );
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  const Item = Parse.Object.extend("item");
  const deleteItem = new Parse.Query(Item);
  const Rent = Parse.Object.extend("rent");
  const rent = new Parse.Query(Rent);
  deleteItem.get(req.params.id, { sessionToken: req.sessionToken }).then(
      (item) => {
      
        rent.equalTo("rented_item",item)
        rent.findAll({ sessionToken: req.sessionToken }).then((rents)=>{
          let NotkRented=true;
          rents.map((element)=> {
            if(element.get('renting_status')==="approved"){
              NotkRented=false;
            }
          })
        
          if(NotkRented){
          Parse.Object.destroyAll(rents,{ sessionToken: req.sessionToken });
          item.destroy({ sessionToken: req.sessionToken }).then(
          (deleted) => {
            res.status(200).send(true);
          },
          (err) => {
            res.status(500).json(err);
          })
          }else{
            res.status(200).send(false);
          }

        })
    },
    (err) => {
      res.status(500).json(err);
    }
  );
});

//GET ITEM
router.get("/find/:id", verifyToken, async (req, res) => {
  const Item = Parse.Object.extend("item");
  const getItemById = new Parse.Query(Item);
  getItemById.get(req.params.id, { sessionToken: req.sessionToken }).then(
    (item) => {
      let photo = item.get("photo");
      let data = {
        id: item.id,
        "Item Name": item.get("item_name"),
        "Item Details": item.get("item_details"),
        "Total initial items": item.get("total_initial_items"),
        "Rented Quantity": item.get("rented_quantity"),
        "Available Items": item.get("available_items"),
        photo: photo,
      };
      res.status(200).json(data);
    },
    (err) => {
      res.status(500).json(err);
    }
  );
});

//GET ALL ITEMS

router.get("/", verifyToken, async (req, res) => {
  const Items = Parse.Object.extend("item");
  const allitems = new Parse.Query(Items);
  try {
    const allItems = await allitems.findAll({ sessionToken: req.sessionToken });

    let items = [];
    allItems.map((item) => {
      let photo = item.get("photo");
      let data = {
        id: item.id,
        item_name: item.get("item_name"),
        item_details: item.get("item_details"),
        total_initial_items: item.get("total_initial_items"),
        available_items: item.get("available_items"),
        rented_quantity: item.get("rented_quantity"),
        photo: photo,
      };

      items.push(data);
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/renterview", verifyToken, async (req, res) => {
  const Items = Parse.Object.extend("item");
  const allitems = new Parse.Query(Items);

  try {
    const allItems = await allitems.findAll({ sessionToken: req.sessionToken });

    let items = [];
    allItems.map((item) => {
      let photo = item.get("photo");
      let data = {
        id: item.id,
        item_name: item.get("item_name"),
        item_details: item.get("item_details"),
        available_items: item.get("available_items"),
        photo: photo,
      };

      items.push(data);
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
