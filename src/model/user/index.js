'use strict';

module.exports = UserModel;

function UserModel(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		id: {
			field: 'id',
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			field: 'name',
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			field: 'email',
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		is_coach: {
			// The default role is an athlete
			field: 'is_coach',
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_deleted: {
			field: 'is_deleted',
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		created_at: {
			field: 'created_at',
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW()
		},
		updated_at: {
			field: 'updated_at',
			type: DataTypes.DATE
		}
	}, {
		// Class vs. Instance methods?
		classMethods: {
			associate: function(models) {
				User.hasMany(models.Workout, {
					foreignKey: 'user_id'
				});
			}
		},
		tableName: 'user',
		timestamps: false,
	});

	return User;
}


