// hash-password.js
const bcrypt = require("bcryptjs"); // or "bcrypt" if your project uses it

const password = "adamantis382025aB@_%%%%%"; // your real password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
