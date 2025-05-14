const express = require('express');
const { getAllEntities, createEntity, updateEntity, deleteEntity } = require('./dao');
const router = express.Router();
const mongoose = require('mongoose');
const buyStocks  = require("./traders-sys-service");
const sellStocks  = require("./traders-sys-service");



// entities:


const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true//cut the white spaces edge 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  shortable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true//adding createdAt updatedAt
});

const stockEntity = "stocks";
const traderEntity = "traders"

const traderSchema = new mongoose.Schema({
  position: {
    type: [{
      stock: mongoose.Schema.Types.ObjectId,
      amount: Number
    }],
  },
  balance: {
    required: true,
    type: Number,
    min: -50_000
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  
 
},{ timestamps: true});
//adding createdAt updatedAt});




let users = [];
router.get('/', (req, res) => {
    res.status(200).send('Hello To trading system')
  })


//get all stocks
router.get("/" + stockEntity, async (req, res) => {
  try {
    //await **mongodb find users info here**

    const stocks = await getAllEntities(stockEntity, stockSchema);

    res.status(200).send(stocks);
    console.log(stocks);
  } catch (err) {
    res.status(500).json({ message: "Failed to get stocks", error: err });
  }
});

//create a new user and id
router.post("/"+ stockEntity, async (req, res) => {
  
  try {
   
    const stock = await createEntity(req.body,stockEntity, stockSchema);
    console.log(stock);
    res.status(200).send(stock);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

router.put("/"+ stockEntity, async (req, res) => {
  
  try {
   
    const stock = await updateEntity(req.body,stockEntity, stockSchema);
    console.log(stock);
    res.status(200).send(stock);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

router.delete("/"+ stockEntity, async (req, res) => {
  
  try {
   
    const stock = await deleteEntity(req.body,stockEntity, stockSchema);
    console.log(stock);
    res.status(200).send(stock);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


//TRADER
//get all TRADERS
router.get("/" + traderEntity, async (req, res) => {
  try {
    //await **mongodb find users info here**

    const traders = await getAllEntities(traderEntity, traderSchema);

    res.status(200).send(traders);
    console.log(traders);
  } catch (err) {
    res.status(500).json({ message: "Failed to get traders", error: err });
  }
});

//create a new user and id
router.post("/"+ traderEntity, async (req, res) => {
  
  try {
   
    const trader = await createEntity(req.body,traderEntity, traderSchema);
    console.log(trader);
    res.status(200).send(trader);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

router.put("/"+ traderEntity, async (req, res) => {
  
  try {
   
    const trader = await updateEntity(req.body,traderEntity, traderSchema);
    console.log(trader);
    res.status(200).send(trader);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

router.delete("/"+ traderEntity, async (req, res) => {
  
  try {
   
    const trader = await deleteEntity(req.body,traderEntity, traderSchema);
    console.log(trader);
    res.status(200).send(trader);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

//general methods:
router.post("/"+ "buy-stocks", async (req, res) => {
  
  try {
   buyStocks();
    // const trader = await deleteEntity(req.body,traderEntity, traderSchema);
    // console.log(trader);
    res.status(200).send("hello");
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

//general methods:
router.post("/"+ "sell-stocks", async (req, res) => {
  
  try {
   sellStocks();
    // const trader = await deleteEntity(req.body,traderEntity, traderSchema);
    // console.log(trader);
    res.status(200).send("hello");
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});



module.exports = router;