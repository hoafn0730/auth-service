'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            fullName: DataTypes.STRING,
            avatar: DataTypes.STRING,
            banner: DataTypes.STRING,
            bio: DataTypes.STRING,
            role: DataTypes.STRING,
            type: DataTypes.STRING,
            code: DataTypes.STRING,
            // active: { type: DataTypes.BOOLEAN, defaultValue: false },
            // require2FA: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
