import { useRouter, Link } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';

import web3 from '../../../../ethereum/web3';

import campaignInstance from '../../../../ethereum/campaign';

const newRequest = () => {
  const [errorMessage, seterrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');

  const router = useRouter();

  const address = router.query.campaignaddress;

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    seterrorMessage('');

    try {
      console.log(address);

      const campaign = campaignInstance(address);

      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      seterrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <a onClick={() => router.push(`/campaigns/${address}/requests`)}>Back</a>
      <h3>Create a Request</h3>
      <Form error={!!errorMessage} onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label="ether"
            labelPosition="right"
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Reciepient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          ></Input>
        </Form.Field>
        <Message
          error
          header="Oops!"
          content={errorMessage ? errorMessage : ''}
        />

        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default newRequest;
