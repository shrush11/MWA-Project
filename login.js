const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
app.use("/assets", express.static("assets"));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'project'
});
app.get('/Assets/final index.html', function(req, res) {
    res.sendFile(path.join(__dirname, '/Assets/final index.html'));
});
app.use(bodyParser.urlencoded({ extended: true }));
console.log('Attempting to connect to the database...');
connection.connect(function(error) {
    if (error) { console.error('Error connecting to database:', error); } else console.log('Database Connected!')
});

function validateForm(username, email, password) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (username === "" || email === "" || password === "" || emailPattern.test(email) === false) {
        return true;
    } else {
        return true;
    }
}
////////////////// Registration Page    ////////////////
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/Assets/login.html");
})
app.post('/submit', function(req, res) {
    const { username, email, password } = req.body;
    if (!validateForm(username, email, password)) {
        return res.send('<h1>Invalid Data</h1>');
    }
    const checkUsername = 'Select* from loginuser where user_name = ?';
    connection.query(checkUsername, [username], function(error, results, fields) {
        if (results.length > 0) {
            res.status(400).send('Username already exists');
        } else {
            const sql = 'Insert into loginuser (user_name, user_email, user_pass) values (?,?,?)';
            connection.query(sql, [username, email, password], function(error, results, fields) {
                if (error) {
                    console.error('Error inserting to database:', error);
                    res.send('<h1>Registration Unsuccessful!</h1>');
                } else {
                    console.log('Successfully inserting to database:');
                    res.redirect(`/Assets/final index.html?username=${encodeURIComponent(username)}`);

                }
            })
        }
    });
});
app.get('/Assets/final index.html', (req, res) => {
    const username = req.query.username;
    res.send(`<h1>Welcome, ${username}!</h1>`);
    console.log(`Welcome, ${username}!`);
});
/////////// Already Have an Acccount Page!!!!!!!!!!!!!
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/Assets/Register.html");
})
app.post("/checkEntry", function(req, res) {
    const { username, email, password } = req.body;
    if (!validateForm(username, email, password)) {
        return res.send('<h1>Invalid Data</h1>');
    }
    const sql = 'Select* from loginuser where user_name = ? and user_email = ? and user_pass = ?';
    connection.query(sql, [username, email, password], function(error, results, fields) {
        if (error) {
            console.error('Error Checking entry:', error);
            res.send('<h1>Login Unsuccessful!</h1>');
        }
        if (results.length > 0) {
            console.log('Entry already exists in database');
            res.redirect(`/Assets/final index.html?username=${encodeURIComponent(username)}`);
        } else {
            res.send('Entry does not exist in database');
        }
    });
});
app.listen(4500);