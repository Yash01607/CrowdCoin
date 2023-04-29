import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaignInstance from '../ethereum/campaign';
import { useRouter } from 'next/router';

export const RequestRow = (props) => {
  const { request, address, id, approversCount, setErrorMessage } = props;

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingFinalize, setloadingFinalize] = useState(false);

  const router = useRouter();

  const readytoFinalize = request.approvalCount > approversCount / 2;

  const approveRequest = async () => {
    const campaign = campaignInstance(address);

    setLoadingApprove(true);
    setErrorMessage('');

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoadingApprove(false);
  };

  const finalizeRequest = async () => {
    const campaign = campaignInstance(address);

    setloadingFinalize(true);
    setErrorMessage('');

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finaliseRequest(id).send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setloadingFinalize(false);
  };

  return (
    <Table.Row
      disabled={request.complete}
      positive={readytoFinalize && !request.complete}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button
            loading={loadingApprove}
            color="green"
            basic
            onClick={approveRequest}
          >
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button
            loading={loadingFinalize}
            color="teal"
            basic
            onClick={finalizeRequest}
          >
            Finalise
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};
