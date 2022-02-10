const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('swiper', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    imgurl: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "图片链接"
    },
    naviurl: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "跳转路径"
    },
    chkStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否有效 1.是 2.否"
    }
  }, {
    sequelize,
    tableName: 'swiper',
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
