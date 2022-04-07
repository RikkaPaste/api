const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goodsdesc', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    seriesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,商品系列id,关联goodsseries表"
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,商品id,关联goods"
    },
    goodsDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "描述"
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
    tableName: 'goodsdesc',
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
