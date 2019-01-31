const express = require('express');
const app = express();
let env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;
const settings = require('./server/config/settings')[env];
const database = require('./server/config/database');

require('./server/models/User').seedAdminUser();
require('./server/config/express')(app);
require('./server/config/routes')(app);
require('./server/config/passport')();

database(settings);

app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});