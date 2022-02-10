const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goodsbrand', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    brandName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "品牌名"
    },
    brandLogo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "品牌logo"
    },
    companyName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "公司名称"
    },
    brandSort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "排序"
    },
    createstamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "创建时间戳"
    },
    updatestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "更新时间戳"
    }
  }, {
    sequelize,
    tableName: 'goodsbrand',
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
