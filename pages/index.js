import React, { useEffect, useState } from 'react';

import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';

const CampaignIndex = () => {
  const [campaignList, setcampaignList] = useState();

  const router = useRouter();

  useEffect(() => {
    const getCampaignList = async () => {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      if (campaigns) {
        setcampaignList(campaigns);
      }
    };
    getCampaignList();
  }, []);

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Button
        floated="right"
        content="Create Campaign"
        icon="add circle"
        primary
        onClick={() => router.push('/campaigns/new')}
      ></Button>
      <Card.Group
        items={
          campaignList &&
          campaignList.map((address) => {
            return {
              header: address,
              description: (
                <a onClick={() => router.push(`campaigns/${address}`)}>
                  View Campiagn!
                </a>
              ),
              fluid: true,
            };
          })
        }
      />
    </Layout>
  );
};

export default CampaignIndex;
