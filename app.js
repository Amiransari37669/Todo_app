const express = require('express');
const mongoose = require('mongoose');

const app = express();

main().then(()=>console.log("connect to mongo successfully")).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/task');
  }

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(require("./routes/todo"));



app.listen(3000,()=>console.log("app listening on port 3000"));

// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })