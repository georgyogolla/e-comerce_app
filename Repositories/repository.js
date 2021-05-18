const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
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

    async create(attrs) {
      attrs.id = this.randomId();

      const records = await this.getAll();
      records.push(attr);
      await this.writeAll(records);

      return records;
    }

    async create(attrs) {
        attrs.id = this.randomId()

        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

        return attrs;
    }
    async getAll() {
        
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        })
        );
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
            let found = true; 
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