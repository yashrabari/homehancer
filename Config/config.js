const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "127.0.0.1",
      user: "root",
      password: "Homeh@ncer123",
      database: "homehencer",
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      connectTimeout: 60000
    },
    listPerPage: 10,
  };
  module.exports = config;