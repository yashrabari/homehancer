
const express = require("express");
const cors=require('cors')
// var multer  = require('multer');
const app = express();
const port = 8900;
const programmingLanguagesRouter = require("./Routes/auth-routes");
app.use(express.json());
app.use(cors({origin:true}))

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.use("/v1/auth", programmingLanguagesRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});