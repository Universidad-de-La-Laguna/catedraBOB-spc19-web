import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Card, Typography, notification } from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { connect, history } from 'umi';
import { waitFor } from '@/utils/wait';

const PcrResultForm = (props) => {
  const { token, apiBaseUri } = props;
  const { insuranceId, pcrId, contractAddress } = props.match.params;

  return (
    <PageContainer>
      <Card>
        <Typography.Title>PCR result</Typography.Title>
        <Typography.Paragraph>
          Please, select the PCR result for the customer you selected by clicking on this link
        </Typography.Paragraph>
        <ProForm
          onFinish={async (data) => {
            const response = await fetch(
              `${apiBaseUri}/insurance/${insuranceId}/pcrRequests/${pcrId}?contractaddress=${contractAddress}`,
              {
                method: 'PATCH',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ result: data.pcrResult }),
              },
            );
            
            if (response.ok) {
              notification.success({
                message: "PCR result registered correctly!",
                description: 'You will be redirected to the welcome page in a moment...',
              });
              
              await waitFor(5000);
              history.push(`/welcome`);
            } else {
              const error = await response.json()
              notification.error({
                message: `Error ${error?.code || ''}`,
                description: `Message: ${error?.message}`,
              });
            }
          }}
        >
          <ProFormSelect
            name="pcrResult"
            options={[
              { label: <span style={{ color: 'red' }}>Positive</span>, value: 'POSITIVE' },
              { label: <span style={{ color: 'blue' }}>Negative</span>, value: 'NEGATIVE' },
              { label: <span style={{ color: 'gray' }}>Inconclusive</span>, value: 'UNKNOWN' },
            ]}
            placeholder="Please select a result"
            rules={[{ required: true, message: 'Please select the result!' }]}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default connect(({ login }) => ({
  token: login.token,
  apiBaseUri: login.apiBaseUri,
}))(PcrResultForm);
