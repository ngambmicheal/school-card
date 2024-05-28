const fs = require('fs');

const file = 'assets/td/td_fr_24.jpg';

const base64 = base64_encode(file);

const newFile = file.replace('.jpg', '');

fs.writeFile(newFile, base64, (err:any) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });



function base64_encode(file:string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}