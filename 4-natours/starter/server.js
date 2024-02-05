const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require("./app");

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});