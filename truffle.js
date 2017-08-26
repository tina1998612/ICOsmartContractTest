module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 4712388,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      network_id: 4,
      host: 'localhost',
      port: 8545,
      from: 'd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30',
      gas: 4000000
    }
  }
};
