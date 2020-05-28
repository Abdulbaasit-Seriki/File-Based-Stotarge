const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const Repository = require('./repository.js');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo extends Repository {

	async createUser (options) {

		options.id = this.generateId();

		const salt = crypto.randomBytes(9).toString('hex');
		const derivedKey = await scrypt(options.password, salt, 64);

		const option = {
			...options,
			password: `${derivedKey.toString('hex')}.${salt}`
		};

		const fileContent = await this.getAll();
		fileContent.push(option);

		await this.saveUser(fileContent);

		return option;
	}

	async comparePasswords(savedPswrd, suppliedPswrd) {
		const [hashedPswrd, savedSalt] = savedPswrd.split('.');

		const newHashBuffer = await scrypt(suppliedPswrd, savedSalt, 64);
		return hashedPswrd === newHashBuffer.toString('hex');
	}

}

module.exports = new UsersRepo('users.json');