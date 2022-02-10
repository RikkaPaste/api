const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    roleName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "角色名称"
    },
    createStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "创建时间戳"
    },
    updateStatmp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "修改时间戳"
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
