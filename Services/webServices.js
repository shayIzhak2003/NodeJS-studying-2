const express = require('express');
const router = express.Router();
let users = [];
router.get('/', (req, res) => {
    res.send('Hello World!')
  })
//get all users 
  router.get('/test-get', (req, res) => {
    console.log(users);
    res.status(200).send(users);
  })

//create a new user and id
router.post('/test-post', (req, res) => {
    const {name,id}=req.body 
    const haveID =users.find(user => user.id===id)
    if(haveID){
        console.log('User already exists');
        return res.status(400).send('User already exists');
    }
    const newUser = { id, name };
    users.push(newUser);
    console.log(users);
     res.status(200).send(users);
  })
  //update a user by id
  router.put('/test-put/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
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
});

//delete user by id
router.delete('/test-delete/:id', (req, res) => {
    const { id } = req.params;
    const user = users.findIndex(user => user.id === id);

    if (user === -1) {
        console.log('User not found');
        return res.status(404).send('User not found');
    }
    users.splice(user, 1);
    console.log(users); 
    res.status(200).send(users);
})
module.exports = router;