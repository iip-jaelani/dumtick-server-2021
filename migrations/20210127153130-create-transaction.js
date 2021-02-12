"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("transactions", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
			},
			user_id: {
				type: Sequelize.TEXT,
			},
			ticket_id: {
				type: Sequelize.TEXT,
			},
			agent_id: {
				type: Sequelize.TEXT,
			},
			address: {
				type: Sequelize.TEXT,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			promo: {
				type: Sequelize.INTEGER,
			},
			quantity: {
				type: Sequelize.INTEGER,
			},
			voucher_id: {
				type: Sequelize.TEXT,
			},
			status: {
				type: Sequelize.STRING,
			},
			methode_payment: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("transactions");
	},
};
