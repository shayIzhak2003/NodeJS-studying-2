const express = require('express');
const { getAllEntities, createEntity, updateEntity, deleteEntity } = require('./dao');
const router = express.Router();
const mongoose = require('mongoose');


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

const stockEntity = "stocks"
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
    min: 50_000
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


//get all users
//get all users
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


  //update a user by id
  router.put('/test-put/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try{
    let haveID =false;
    users = users.map(user => {
        if (user.id == id) {
          haveID = true;
            return { ...user, name };
        }
        return user;
    });
    if(!haveID){
      console.log('User not found');
      return res.status(404).send('User not found');
  }
    console.log(users);
    res.status(200).send(users);
  }
  catch(err){
    res.status(500).json({message: 'Failed to update user', error: err});
  }
});

//delete user by id
router.delete('/test-delete/:id', async (req, res) => {
    const { id } = req.params;
    try{
    const userID = users.findIndex(user => user.id === id);
    if (userID === -1) {
        console.log('User not found');
        return res.status(404).send('User not found');
    }
    users.splice(userID, 1);
    console.log(users); 
    res.status(200).send(users);
  }
  catch(err){
    res.status(400).json({message: 'Failed to delete user', error: err});
  }
})


module.exports = router;