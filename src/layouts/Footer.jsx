import { DefaultFooter } from '@ant-design/pro-layout';
import { GithubOutlined } from '@ant-design/icons';
import React from 'react';

const GithubIconWithText = ({ text }) => (
  <>
    <GithubOutlined /> <span>{text}</span>
  </>
);

const Footer = () => (
  <DefaultFooter
    copyright={`${new Date().getFullYear()}`}
    links={[
      {
        key: 'SPC19 WEB',
        title: <GithubIconWithText text="SPC19 WEB" />,
        href: 'https://github.com/Universidad-de-La-Laguna/catedraBOB-spc19-api',
        blankTarget: true,
      },
      {
        key: 'SPC19 API',
        title: <GithubIconWithText text="SPC19 API" />,
        href: 'https://github.com/Universidad-de-La-Laguna/catedraBOB-spc19-api',
        blankTarget: true,
      },
    ]}
  />
);

export default Footer;
