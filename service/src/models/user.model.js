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
		// for future purposes(if required to add own auth logic instead of google oauth)
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		avatar_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.ARRAY(DataTypes.ENUM("ROLE_ADMIN", "ROLE_USER")),
			allowNull: false,
			defaultValue: ["ROLE_USER"],
		},
	});
	return User;
};
