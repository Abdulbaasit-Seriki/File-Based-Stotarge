const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {

	constructor(filename) {

		if (!filename) {
			throw new Error(`Filename must be provided`);
		}

		this.filename = filename;
		// Check if the file exists on the records drive
		// Because a constructor function doesnt allow the use of asynchronous code 
		try {
			fs.accessSync(this.filename);
		}
		catch(err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async getAll ()  {
		try {
			return JSON.parse(await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			}));
		}
		catch (err) {
			console.log(err);
		}
	}

	async create (options) {
		options.id = this.generateId();

		const records = await this.getAll();
		records.push(options);
		await this.save(records);

		return options;
	}
	
	async save (data) {
		await fs.promises.writeFile(this.filename, JSON.stringify(data, null, 2));
	}

	generateId() {
		return crypto.randomBytes(6).toString('hex');
	}

	async getById(id) {
		const records = await this.getAll();
		return records.find(record => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filterdRecords = records.filter(record => record.id !== id);

		await this.save(filterdRecords);
	}

	async update(id, options) {
		const records = await this.getAll();
		const record = records.find(record => record.id === id);

		if(!record) {
			throw new Error(`Record with ID of ${id} not found `);
		}

		Object.assign(record, options);
		return await this.save(records);
	}

	async getByFilters(options) {

		const records = await this.getAll();

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