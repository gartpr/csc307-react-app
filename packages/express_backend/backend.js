// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});   

const users = { 
    users_list : [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       },
    ]
 }

 app.get('/users', (req, res) => {
    // filtering by name or job or both
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined){
        let result = findUserByBoth(name, job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined) {
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else if (job != undefined) {
        let result = findUserByJob(job);
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name); 
}

const findUserByJob = (job) => { 
    return users['users_list']
        .filter( (user) => user['job'] === job); 
}

const findUserByBoth = (name, job) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name).filter((user) => user['job'] === job); 
}
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id); 
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);

const addUser = (user) => {
    // add id if it doesn't exist
    if(user['id'] === undefined) {
        user['id'] = buildId();
    }
    // add new user to table
    users['users_list'].push(user);
    return user;
}

function buildId() {
    // generates random id and adds to table
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const charactersLength = characters.length;
    const numbersLength = numbers.length;
    let counter = 0;
    while (counter < 3) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    counter = 0;
    while (counter < 3) {
        result += numbers.charAt(Math.floor(Math.random() * numbersLength));
        counter += 1;
    }
    return result;
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    let data = addUser(userToAdd);
    // returns post status and code
    res.status(201).send(data);
});


const removeUser = (id) => {
    // find user by id in table and remove using splice
    const index = users['users_list'].findIndex((user) => user['id'] === id);
    if (index !== -1) {
        const removedUser = users['users_list'].splice(index, 1)[0];
        return removedUser;
    }
    // return null if user not found
    return null;
}

app.delete('/users/:id', (req, res) => {
    // get the id
    const userToDelete = req.params.id;
    // call function to remove user from array
    const removedUser = removeUser(userToDelete);
    // send error or success codes
    if (!removedUser) {
        res.status(404).send('Resource not found.');
    } else {
        res.status(204).send();
    }
})