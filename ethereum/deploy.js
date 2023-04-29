const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'charge people duty either fatal kitchen promote voyage fire sleep minimum trim',
  'https://sepolia.infura.io/v3/6bdc3d0cbf7d4e5d9d59bedd4abb49b1'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  try {
    const result = await new web3.eth.Contract(
      JSON.parse(compiledFactory.interface)
    )
      .deploy({ data: compiledFactory.bytecode })
      .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
  } catch (error) {
    console.log(error);
  }

  provider.engine.stop();
};
deploy();
