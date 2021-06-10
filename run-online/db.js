const ReplitDatabase = require('@replit/database');
class Database {
    constructor() {
        /** @type {ReplitDatabase} */
        this.db = new ReplitDatabase();
        this.contents = {};
        this.db.get('main', { raw: true }).then(content => {
            this.contents = JSON.parse(content);
            setInterval(() => {
                this.db.set('main', JSON.stringify(this.contents));
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