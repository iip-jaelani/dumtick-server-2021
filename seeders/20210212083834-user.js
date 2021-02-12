"use strict";
var faker = require("faker");
var bcrypt = require("bcryptjs");
const { middleware } = require("../routes/middleware");
var dummy = [...new Array(1).keys()].map((d, i) => {
	return {
		id: faker.random.uuid(),
		name: faker.name.findName(),
		email: faker.internet.email(),
		number_phone: faker.phone.phoneNumberFormat(),
		password: bcrypt.hashSync("password"),
		img_profile: faker.image.cats(),
		point: "100000",
		status: "",
		token: "",
		devices_token: "yyy",
		is_active: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
});
for (let a of dummy) {
	a.token = middleware.createToken(a);
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("users", [...dummy]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
