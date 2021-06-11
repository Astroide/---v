const ReplitDatabase = require('@replit/database');
class Database {
  constructor() {
    /** @type {ReplitDatabase} */
    this.db = new ReplitDatabase();
    this.contents = {};
    this.db.get('main').then(content => {
      console.log(content);
      this.contents = JSON.parse(decodeURIComponent(content));
      console.log(this.contents);
      setInterval(() => {
        this.db.set('main', encodeURIComponent(JSON.stringify(this.contents)));
      }, 15000);
    });
  }
  getKey(key) {
    return this.contents[key];
  }
  setKey(key, value) {
    return this.contents[key] = value;
  }
}
module.exports = Database;