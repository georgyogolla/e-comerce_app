const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

//Turn callback to promise
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository{
    constructor(filename) {
      if (!filename) {
          throw new Error('Creating a repository requires a filename');
      }
      this.filename = filename;
      try {
          fs.accessSync(this.filename);
      } catch (err) {
          fs.writeFileSync(this.filename, '[]');
      }
    }


    async getAll() {
        
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        })
        );
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

//saving users data in our hard drive
    async writeAll(records) {
        await fs.promises.writeFile(
            this.filename, 
            JSON.stringify(records, null, 2)
            );
    }
 //generating random id's for records using crypto.randomBytes
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

//getting a single user by id
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    //deleting users using their id's
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    //updating records
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        //if record is found, we update it here
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    //adding filtering logic
    async getOneBy(filters) {
        const records =  await this.getAll();

// for of loop iterates over an array
        for (let record of records) {
            let found = true; //
//for in loop iterates over an object
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
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
