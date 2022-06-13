
const { Model, DataTypes, Sequelize } = require("sequelize");


class Entry extends Model {

   static init(sequelize) {
      super.init({
         url: DataTypes.STRING
      }, { sequelize })
   }
}


(async () => {

   const dialect = `sqlite::${__dirname}/db.sqlite`;
   const sequelize = new Sequelize(dialect, { logging: false, dialect: 'sqlite' }); 

   Entry.init(sequelize);

   await sequelize.sync({ force: true });

})();


module.exports = {
   Entry
}