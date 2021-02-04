const express = require('express');
const bodyParser = require('body-parser')//middleware that hepls holding form requests for the body

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send(`
    <div>
    <form method="POST">
    <input name="email" placeholder="email"/>
    <input name= "password" placeholder="password"/>
    <input name="password confimation" placeholder="password confirmation"/>
    <button>SIGN UP</button>
    </form>
    </div>
    `);
});

app.post('/', (req, res) => {
    // req.on('data', data => {
    //     const parsed = data.toString('utf8').split('&');
    //     const formData = {};
    //     for (let pair of parsed) {
    //         const [key, value] = pair.split('=');
    //         formData[key] = value;
    //     }
    //     console.log(formData);
    // })
    console.log(req.body);
    res.send('admin created');
})
app.listen(3000, () => {
    console.log('LISTENING');
});