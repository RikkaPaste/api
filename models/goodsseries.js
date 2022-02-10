const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goodsseries', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    cateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: "外键,分类id,关联goodscategory"
    },
    seriesName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "系列名称"
    },
    dparamValues: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "",
      comment: "动态属性集合"
    },
    sattrValues: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "",
      comment: "静态属性集合"
    },
    isstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否可用 1.是 2.否"
    }
  }, {
    sequelize,
    tableName: 'goodsseries',
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
