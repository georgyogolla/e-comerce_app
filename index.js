
const express = require('express');
const bodyParser = require('body-parser')//middleware that helps in holding form requests 
const cookieSession = require('cookie-session');
// const usersRepo = require('./Repositories/users');
const authRouter = require('./routes/admin/auth');
const app = express();
const productsRouter = require('./routes/admin/products');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    cookieSession({
   keys:  ['lkinhdkg123k']
    })
    );

app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
    console.log('LISTENING');
});