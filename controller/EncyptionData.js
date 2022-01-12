const bcrypt = require('bcrypt');
 const encryptiondata=(data)=>{
const saltRounds = 10;
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(data, salt, function(err, hash) {
        if (err) throw err
        return hash
    });
});
}
 const decryptiondata=(data,hash)=>{
    bcrypt.compare(data, hash, function(err, result) {
        return result    });

}
module.exports={encryptiondata,decryptiondata}