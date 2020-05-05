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

	async getFileContents ()  {
		return JSON.parse(await fs.promises.readFile(this.filename, {
			encoding: 'utf8'
		}));
	}
}

const test = async () => {
	const newUser = new Users('users.json');
	console.log(await newUser.getFileContents());
}
test();