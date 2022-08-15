var express = require('express');
var cors = require('cors');
require('dotenv').config();

//Add multer 
const multer = require('multer')
//set up multer.
const upload = multer({ dest: 'uploads_tmp/' }).single('upfile');
//we will need this so we don't pollute the disk with dummy files
const fs = require('fs');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//SOLUTION with multer

app.post('/api/fileanalyse', async function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json({ error: err });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.json({ error: "An unknown error occurred when uploading. " + err });
    }
    // Everything went fine.
    fileData = req.file;

    //Delete the uploaded file?
    fs.unlink(fileData.path, (err => {
      if (err)
        console.log(err);
      else {
        console.log("File Deleted");
      }
    }))

    //ok!
    res.json({
      name: fileData.originalname,
      type: fileData.mimetype,
      size: fileData.size
    });
  })
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
