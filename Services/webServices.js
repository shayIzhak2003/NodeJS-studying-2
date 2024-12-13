const express = require('express');
const router = express.Router();
let users = [];
router.get('/', (req, res) => {
    res.status(200).send('Hello World!')
  })
//get all users
//get all users
router.get("/test-get", async (req, res) => {
  try {
    //await **mongodb find users info here**
    res.status(200).send(users);
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to send users to client", error: err });
  }
});

//create a new user and id
router.post("/test-post", async (req, res) => {
  const { name, id } = req.body;
  try {
    //await **mongodb find user here**
    const haveID = users.find((user) => user.id === id); //Not needed when fetching from db
    if (haveID) {
      console.log("User already exists");
      return res.status(400).send("User already exists");
    }
    const newUser = { id, name };
    //await **mongodb insertOne user here**
    users.push(newUser); //Not needed when inserting to db
    console.log(users);
    res.status(200).send(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to save new user", error: err });
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