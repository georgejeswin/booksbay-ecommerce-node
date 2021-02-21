const mongoClient = require("mongodb").MongoClient;

const state = {
  db: null,
};

module.exports.connect = function (done) {
  const dbname = "booksbay-db";

  const url = `mongodb+srv://admin:ahIops6aLzk4USjR@cluster0.lrme3.mongodb.net/${dbname}?retryWrites=true&w=majority`;

  mongoClient.connect(url, (err, data) => {
    if (err) return done(err);
    state.db = data.db(dbname);
    done();
  });
};
module.exports.get = function () {
  return state.db;
};
