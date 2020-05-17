const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo {

	constructor(filename) {

		if (!filename) {
			throw new Error(`Filename must be provided`);
		}

		this.filename = filename;
		// Check if the file exists on the users drive
		// Because a constructor function doesnt allow the use of asynchronous code 
		try {
			fs.accessSync(this.filename);
		}
		catch(err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async getAllUsers ()  {
		try {
			return JSON.parse(await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			}));
		}
		catch (err) {
			console.log(err);
		}
	}

	async createUser (options) {

		options.id = this.generateId();

		const salt = crypto.randomBytes(9).toString('hex');
		const derivedKey = await scrypt(options.password, salt, 64);

		const option = {
			...options,
			password: `${derivedKey.toString('hex')}.${salt}`
		};

		const fileContent = await this.getAllUsers();
		fileContent.push(option);

		await this.saveUser(fileContent);

		return option;
	}

	async comparePasswords(savedPswrd, suppliedPswrd) {
		const [hashedPswrd, savedSalt] = savedPswrd.split('.');

		const newHashBuffer = await scrypt(suppliedPswrd, savedSalt, 64);
		return hashedPswrd === newHashBuffer.toString('hex');
	}

	async saveUser (data) {
		await fs.promises.writeFile(this.filename, JSON.stringify(data, null, 2));
	}

	generateId() {
		return crypto.randomBytes(6).toString('hex');
	}

	async getById(id) {
		const users = await this.getAllUsers();
		return users.find(user => user.id === id);
	}

	async delete(id) {
		const records = await this.getAllUsers();
		const filterdRecords = records.filter(record => record.id !== id);

		await this.saveUser(filterdRecords);
	}

	async update(id, options) {
		const records = await this.getAllUsers();
		const record = records.find(record => record.id === id);

		if(!record) {
			throw new Error(`Record with ID of ${id} not found `);
		}

		Object.assign(record, options);
		return await this.saveUser(records);
	}

	async getByFilters(options) {

		const records = await this.getAllUsers();

		for(let record of records) {
			let found = true;

			for(let key in options) {

				if (record[key] !== options[key]) {
					found = false;
				}
			}

			if (found === true) {
				return record;
			}
		}
	}
}

module.exports = new UsersRepo('users.json');