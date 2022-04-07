const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goodscategory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    cateName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "类名"
    },
    catePid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,父级id,关联本身"
    },
    cateLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "等级 1.一级 2.二级 3.三级"
    },
    cateSort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "排序"
    },
    cateLogo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "logo"
    },
    createStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "创建时间戳"
    },
    updateStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "更新时间戳"
    }
  }, {
    sequelize,
    tableName: 'goodscategory',
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
