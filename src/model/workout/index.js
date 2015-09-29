'use strict';

module.exports = WorkoutModel;

function WorkoutModel(sequelize, DataTypes) {
	var Workout = sequelize.define('Workout', {
		id: {
			field: 'id',
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		// foreign key
		user_id: {
			field: 'user_id',
			type: DataTypes.UUID,
			allowNull: false
		},
		type: {
			field: 'type',
			type: DataTypes.STRING,
			allowNull: false,
		},
		start_time: {
			field: 'start_time',
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		end_time: {
			field: 'end_time',
			type: DataTypes.DATE
		},
		is_deleted: {
			field: 'is_deleted',
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		// Class vs. Instance methods?
		classMethods: {
			associate: function(models) {
				Workout.belongsTo(models.User, {
					foreignKey: 'user_id'
				});
			}
		},
		tableName: 'workout',
		timestamps: false,
	});

	return Workout;
}