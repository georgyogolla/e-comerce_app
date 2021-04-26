const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

//Turn callback to promise
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository{
       async comparePasswords(saved, supplied) {
        //saved -> password saved in our database. 'hashed.salt'
        //supplied -> password given to us by a user trying to sign in

        // const result = saved.split('.'); //splits the hashed and the salt part of the password to two separate entities
        // const hashed = result[0];
        // const salt = result[1];

        //short method for the above 
        const [hashed, salt] = saved.split('.');
        const hashedSupplied = await scrypt(supplied, salt, 64);

        return hashed === hashedSupplied.toString('hex');
    }
    
    
    //creating new users attributes
    async create(attrs) {
        attrs.id = this.randomId();//assigns random id's to new users
        // attrs === { email: '', password: ''}
        const salt = crypto.randomBytes(8).toString('hex');
        const hashed = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${hashed.toString('hex')}.${salt}`
        };
        records.push(record);
        await this.writeAll(records);
        return record;
    }
}

//exporting instance of class
module.exports = new UsersRepository('users.json');

// testing the flow
// const test = async () => {
// const repo = new UsersRepository('users.json');

// const user = await repo.getOneBy({email:'test@test.com', password: 'mypasswordx'})

// await repo.update('ab9f5a7a', { password: 'mypasswordx' });

// const user = await repo.getOne('c154c57c')
// await repo.delete('c154c57c');

// await repo.create({email:'test@test.com'});

// const users = await repo.getAll();

// console.log(users);
// console.log(user);
// }

// test();
