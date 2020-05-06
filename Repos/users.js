const fs = require('fs');

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
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAllUsers ()  {
		return JSON.parse(await fs.promises.readFile(this.filename, {
			encoding: 'utf8'
		}));
	},

	async createUser (options) {
		// Get the contents of the file
		const fileContent = await this.getAllUsers;
		// Add the new data to it
		fileContent.push(options);

		await fs.promises.writeFile(this.filename, JSON.stringify(fileContent));
	}
}

const test = async () => {
	const newUser = new Users('users.json');
	await newUser.createUser({name: hey, email: test@gmail.com});
	console.log(await newUser.getAllUsers());
}
test();