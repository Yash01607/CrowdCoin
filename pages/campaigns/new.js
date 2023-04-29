import React, { Component, useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const newCampaign = () => {
  const [mimimumContribution, setmimimumContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setErrorMessage('');
    setLoading(true);

    try {
      await factory.methods
        .createCampaign(mimimumContribution)
        .send({ from: accounts[0] });

      setLoading(false);

      router.push('/');
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign!</h3>
      <Form error={!!errorMessage} onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={mimimumContribution}
            onChange={(e) => setmimimumContribution(e.target.value)}
            label="wei"
            labelPosition="right"
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

export default newCampaign;
