const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goodsimg', {
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
      comment: "外键,商品系列id,关联goodsseries"
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,商品id,关联goods"
    },
    maxImg: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "最大尺寸图片地址"
    },
    midImg: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "中等尺寸图片地址"
    },
    minImg: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "最小尺寸图片地址"
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
      comment: "修改时间戳"
    }
  }, {
    sequelize,
    tableName: 'goodsimg',
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
