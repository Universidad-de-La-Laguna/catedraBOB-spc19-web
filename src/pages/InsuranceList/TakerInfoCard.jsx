import { MailOutlined, MobileOutlined, PhoneOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';

export default ({ takerData }) => (
  <Card style={{ marginBottom: '3rem' }}>
    <ProDescriptions column={2} title="Taker info">
      <ProDescriptions.Item label="ID">{takerData.takerId}</ProDescriptions.Item>
      <ProDescriptions.Item label="Name">{takerData.takerFullName}</ProDescriptions.Item>
      <ProDescriptions.Item label="Address" valueType="textarea">
        {takerData.takerContactAddress} <br />
        {takerData.takerContactPostalCode} <br />
        {takerData.takerContactTown} <br />
        {takerData.takerContactLocation}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="Contact" valueType="textarea">
        <PhoneOutlined /> {takerData.takerContactTelephone} <br />
        <MobileOutlined /> {takerData.takerContactMobile} <br />
        <MailOutlined /> {takerData.takerContactEmail}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="IBAN" copyable={true}>
        {takerData.takerIBAN}
      </ProDescriptions.Item>
    </ProDescriptions>
  </Card>
);
