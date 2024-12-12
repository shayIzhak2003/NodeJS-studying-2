const express = require('express');
const router = express.Router();
let users = [];
router.get('/', (req, res) => {
    res.send('Hello World!')
  })
//get all users 
  router.get('/test-get', (req, res) => {
    console.log(users);
    res.send(users);
  })

//create a new user and id
router.post('/test-post', (req, res) => {
    const {name,id}=req.body 
    const newUser = { id, name };
    users.push(newUser);

    console.log(users);
    res.send(users);
  })
  //update a user by id
  router.put('/test-put/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    users = users.map(user => {
        if (user.id == id) {
            return { ...user, name };
        }
        return user;
    });
    console.log(users);
    res.send(users);
});

//delete user by id
router.delete('/test-delete/:id', (req, res) => {
    const { id } = req.params;
    users = users.filter(user => user.id!= id);
    console.log(users); 
    res.send(users);
})
module.exports = router;