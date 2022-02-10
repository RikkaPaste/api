const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    goodsName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "商品名称",
      unique: "goods_name"
    },
    goodsPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "商品价格"
    },
    goodsNumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "商品数量"
    },
    goodsWeight: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "商品重量"
    },
    goodsLiLv: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "商品利率"
    },
    catId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,类型id,关联goodscategory"
    },
    seriesFlag: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "系列属性标识"
    },
    goodsBigLogo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "图片logo大图"
    },
    goodsSmallLogo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "图片logo小图"
    },
    chkStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:正常  2:禁用"
    },
    createStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "添加商品时间戳"
    },
    updateStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "修改商品时间戳"
    },
    catOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,一级分类id,关联goodscategory"
    },
    catTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,二级分类id,关联goodscategory"
    },
    catThreeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,三级分类id,关联goodscategory"
    },
    hotMumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "热卖数量"
    },
    isPromote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "是否促销 1.是 2.否"
    },
    isLayout: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "是否上首页楼层 1.是 2.否"
    },
    goodsStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      comment: "商品状态 2: 未通过 3: 审核中 1: 已审核"
    }
  }, {
    sequelize,
    tableName: 'goods',
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
      {
        name: "goods_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "goodsName" },
        ]
      },
      {
        name: "goods_price",
        using: "BTREE",
        fields: [
          { name: "goodsPrice" },
        ]
      },
      {
        name: "add_time",
        using: "BTREE",
        fields: [
          { name: "createStamp" },
        ]
      },
    ]
  });
};
