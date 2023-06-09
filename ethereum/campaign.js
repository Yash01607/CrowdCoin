import web3 from './web3';
import Campaign from './build/Campaign.json';

export default (address) => {
  const campaignInstance = new web3.eth.Contract(
    JSON.parse(Campaign.interface),
    address
  );

  return campaignInstance;
};
