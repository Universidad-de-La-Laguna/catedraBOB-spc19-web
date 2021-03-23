import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Card, Typography } from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { connect } from 'umi';
import request from '@/utils/request';

const PcrResultForm = (props) => {
  const { token, apiBaseUri } = props;
  const { insuranceId, pcrId } = props.match.params;

  return (
    <PageContainer>
      <Card>
        <Typography.Title>PCR result</Typography.Title>
        <Typography.Paragraph>
          Please, select the PCR result for the customer you selected by clicking on this link
        </Typography.Paragraph>
        <ProForm
          onFinish={async (data) => {
            const response = await request(
              `${apiBaseUri}/insurance/${insuranceId}/pcrRequests/${pcrId}`,
              {
                method: 'PATCH',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                data: { result: data.pcrResult },
              },
            );

            if (response.ok === true || response.ok === undefined) {
              message.success('Submitted successfully');
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

export default connect(({ login, settings }) => ({
  token: login.token,
  apiBaseUri: settings.apiBaseUri,
}))(PcrResultForm);
