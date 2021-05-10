import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, List } from 'antd';
import { useIntl, FormattedMessage, connect, Link } from 'umi';
import {
  FormOutlined,
  HeartFilled,
  HomeFilled,
  LockFilled,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const data = [
  {
    title: 'Insurer',
    avatar: <LockFilled />,
    description:
      'Thanks to the blockchain technology, the insurer can trust the system and pay without needing to know the sensible information of the clients',
  },
  {
    title: 'Hotels',
    avatar: <HomeFilled />,
    description:
      'Can request insurances immediately, easily and transparently so their customers and themselves can feel safer',
  },
  {
    title: 'Laboratories',
    avatar: <HeartFilled />,
    description:
      'Will receive PCR requests automatically and inform their results also in a comfortable manner',
  },
];

const Welcome = ({ currentAuthority }) => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <Typography.Title>Welcome {currentAuthority}</Typography.Title>
        <Typography.Paragraph>
          SPC-19 is a spanish acronym that stands for "Parametric Insurance for Covid-19". It is a
          prototype product made to cover the risk of contracting the SARS-COV-2 virus during a stay
          in a hotel room. It is based on the Blockchain technology to ensure security, privacy,
          transparency and trust among all the participating agents:
        </Typography.Paragraph>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <Typography.Paragraph style={{ marginTop: '3rem' }}>
          As a {currentAuthority} you can:
        </Typography.Paragraph>
        <List itemLayout="horizontal" style={{ marginLeft: '1rem' }}>
          {currentAuthority === 'taker' && (
            <List.Item.Meta
              avatar={<FormOutlined />}
              title={<Link to="/new">Create a new insurance</Link>}
            />
          )}
          {currentAuthority === 'taker' && (
            <List.Item.Meta
              avatar={<UnorderedListOutlined />}
              title={<Link to="/insurances">See all your insurances</Link>}
            />
          )}
          {currentAuthority === 'insurer' && (
            <List.Item.Meta
              avatar={<UnorderedListOutlined />}
              title={<Link to="/insurances">See all insurances</Link>}
            />
          )}
          {currentAuthority === 'lab' && (
            <List.Item.Meta avatar={<SendOutlined />} title="Set a PCR result" />
          )}
        </List>
      </Card>
    </PageContainer>
  );
};

export default connect(({ login }) => ({
  currentAuthority: login.currentAuthority,
}))(Welcome);
