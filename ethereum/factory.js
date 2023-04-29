import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x3076dF5F1aC8a65A5b3ddA2E7c3556DC59c82788'
);

export default factoryInstance;
