const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelizeInstance) => {
	const User = sequelizeInstance.define("User", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		avatar_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	return User;
};
