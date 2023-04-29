import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import campaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router';

const ContributeForm = (props) => {
  const [amountToContribute, setamountToContribute] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const campaign = campaignInstance(props.address);

    setErrorMessage('');
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.conbribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amountToContribute, 'ether'),
      });

      //   created a custom api to revalidate a staticProsp
      //   of a specific routes.
      const revalidateResponse = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: props.address }),
      });

      router.push(`/campaigns/${props.address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setamountToContribute('');
    setLoading(false);
  };

  return (
    <Form error={!!errorMessage} onSubmit={onSubmit}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={amountToContribute}
          onChange={(e) => setamountToContribute(e.target.value)}
          label="ether"
          labelPosition="right"
        ></Input>
      </Form.Field>
      <Message
        error
        header="Oops!"
        content={errorMessage ? errorMessage : ''}
      />

      <Button loading={loading} primary>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
