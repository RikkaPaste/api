const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rolesandmenu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    menuid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,权限菜单id,关联menu",
      references: {
        model: 'menu',
        key: 'id'
      }
    },
    roleid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,角色id,关联role",
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'rolesandmenu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_rolesandmenu_roles",
        using: "BTREE",
        fields: [
          { name: "roleid" },
        ]
      },
      {
        name: "fk_rolesandmenu_menu",
        using: "BTREE",
        fields: [
          { name: "menuid" },
        ]
      },
    ]
  });
};
