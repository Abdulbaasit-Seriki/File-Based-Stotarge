const fs = require('fs');
const crypto = require('crypto');

class Users {

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

		const fileContent = await this.getAllUsers();
		fileContent.push(options);

		await this.saveUser(fileContent);
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
}

const test = async () => {

	const newUser = new Users('users.json');
	const user = await newUser.getById("e410738a5ccc");
	console.log(user);
}
test();