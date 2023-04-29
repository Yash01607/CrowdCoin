import React, { useEffect, useState } from 'react';
import factory from '../../../ethereum/factory';
import Layout from '../../../components/Layout';
import campaignInstance from '../../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../../components/ContributeForm';
import { useRouter } from 'next/router';

function Campaign(props) {
  const {
    minimumContribution,
    balance,
    requestsCount,
    approversCount,
    manager,
    address,
  } = props.campaignData;

  const [reRender, setreRender] = useState(false);

  const router = useRouter();

  const items = [
    {
      header: manager,
      meta: 'Address of Manager',
      description:
        'The manager created this campaign and can create requests to withdraw money',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description:
        'You must contribute at least this much wei to become an approver',
    },
    {
      header: requestsCount,
      meta: 'Number of Requests',
      description:
        'A request tries to withdraw money from the contract. Requests must be approved by approvers',
    },
    {
      header: approversCount,
      meta: 'Number of Approvers',
      description: 'Number of people who have already donated to this campaign',
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description:
        'The balance is how much money this campaign has left to spend.',
    },
  ];

  return (
    <Layout>
      <h1>Campaign Show</h1>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items}></Card.Group>
          </Grid.Column>

          <Grid.Column width={6}>
            <ContributeForm
              address={address}
              setreRender={setreRender}
              reRender={reRender}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button
              onClick={() => router.push(`/campaigns/${address}/requests`)}
              primary
            >
              View Requests
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

export async function getStaticPaths(params) {
  let campaigns;

  try {
    campaigns = await factory.methods.getDeployedCampaigns().call();
  } catch (error) {
    console.log(error.message);
  }

  return {
    fallback: 'blocking',
    paths: campaigns?.map((address) => ({
      params: {
        campaignaddress: address.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const campaignAddress = context.params.campaignaddress;

  const campaign = campaignInstance(campaignAddress);

  let campaignDetails;

  try {
    campaignDetails = await campaign.methods.getSummary().call();
  } catch (error) {
    console.log(error.message);
  }

  return {
    props: {
      campaignData: {
        address: campaignAddress,
        minimumContribution: campaignDetails[0],
        balance: campaignDetails[1],
        requestsCount: campaignDetails[2],
        approversCount: campaignDetails[3],
        manager: campaignDetails[4],
      },
    },
  };
}

export default Campaign;
