const express = require('express');
const router = require('./Services/webServices'); 
const router2 = require('./Services/trade-sys'); 

const PORT = 3000;
const app = express();
const {runMe} = require('./Services/cmd-service');
const { connectDB } = require('./Services/dao');

app.use(express.json());
app.use('/api', router); 
app.use('/trade-sys', router2); 
// connectDB();

app.listen(PORT, () => {
  
  console.log(`Server running on http://localhost:${PORT}`);

  // runMe()
});
