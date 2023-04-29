import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Label, Menu, Message, Table } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import campaignInstance from '../../../../ethereum/campaign';
import { RequestRow } from '../../../../components/RequestRow';

const index = (props) => {
  const router = useRouter();

  const [errorMessage, seterrorMessage] = useState('');

  // console.log(props?.address, props.requests);

  return (
    <Layout>
      <h3>Requests</h3>
      <Button
        floated="right"
        style={{ marginBottom: 10 }}
        primary
        onClick={() => {
          router.push(`/campaigns/${props?.address}/requests/new`);
        }}
      >
        Add Request
      </Button>
      {errorMessage && (
        <Message
          error
          header="Oops!"
          content={errorMessage ? errorMessage : ''}
        />
      )}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalise</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props?.requests?.map((request, index) => {
            return (
              <RequestRow
                setErrorMessage={seterrorMessage}
                approversCount={props.approversCount}
                id={index}
                request={request}
                key={index}
                address={props?.address}
              />
            );
          })}
        </Table.Body>
      </Table>

      <div>Found {props.requests?.length} requests</div>
    </Layout>
  );
};

export default index;

index.getInitialProps = async (context) => {
  const address = context.query.campaignaddress;
  const campaign = campaignInstance(address);

  try {
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, approversCount };
  } catch (error) {
    console.log(error);
    return {};
  }
};
