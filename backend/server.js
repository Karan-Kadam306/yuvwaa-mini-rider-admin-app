const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const ridersRoute = require("./routes/riders");
const bikesRoute = require("./routes/bikes");
const assignmentsRoute = require("./routes/assignments");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/riders", ridersRoute);
app.use("/api/bikes", bikesRoute);
app.use("/api/assignments", assignmentsRoute);

// Test route
app.get('/', (req, res) => {
  res.send("Backend server is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
