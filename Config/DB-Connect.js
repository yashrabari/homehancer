var tunnel = require('tunnel-ssh')
var Sequelize = require('sequelize')

const config = {
  // I have confirmed that the local values are unnecessary (defaults work)
  // Configuration for SSH bastion
  username: 'root',
  host: '62.72.56.45',
  port: 22,
  password: 'HomeH@ncer123',
  // Configuration for destination (database)
  dstHost: '127.0.0.1',
  dstPort: 3345,
}
// NOTE: Moved to its own function, refactor likely fixed a few issues along the way
module.exports=
  new Promise(async (resolve, reject) => {
    await tunnel(config, async (error) => {
      console.log('tunnel connected')
      if (error) return reject(error)
      const db = new Sequelize('homehencer', 'root', 'HomeH@ncer123', {
        dialect: 'mysql',
        // NOTE: This is super important as the tunnel has essentially moved code execution to the database server already...
        host: 'localhost',
        port: 3345,
      })
      console.log('database connected')
      console.log(typeof db)
      return resolve(db)
    })
  })

