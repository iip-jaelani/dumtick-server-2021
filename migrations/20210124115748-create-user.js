"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("users", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
			},
			name: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			number_phone: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			img_profile: {
				type: Sequelize.TEXT,
			},
			point: {
				type: Sequelize.INTEGER,
			},
			status: {
				type: Sequelize.STRING,
			},
			token: {
				type: Sequelize.TEXT,
			},
			devices_token: {
				type: Sequelize.TEXT,
			},
			is_active: {
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users");
	},
};
