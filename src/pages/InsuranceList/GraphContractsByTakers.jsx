import { SINISTER_ENUM } from '@/utils/data';
import React from 'react';
import { Divider, Typography } from 'antd';
import moment from 'moment';
import { Column } from '@ant-design/charts';

export default ({ data }) => {
  const contractCount = data.map((row) => ({
    takerId: row.taker.takerId,
    takerName: row.taker.takerFullName,
    count: 1,
    sinister: Object.keys(SINISTER_ENUM)[row.sinister],
  }));

  const groupedData = contractCount.reduce((result, row) => {
    const currentTaker = row.takerId;
    const updatedResult = result;

    updatedResult[currentTaker] = updatedResult[currentTaker] || [];
    const currentCell = updatedResult[currentTaker].find(
      (value) => value.sinister === row.sinister,
    );

    if (currentCell) {
      currentCell.count += 1;
    } else {
      updatedResult[currentTaker].push({
        count: 1,
        sinister: row.sinister,
        takerName: row.takerName,
      });
    }

    return updatedResult;
  }, {});

  const resultingData = Object.keys(groupedData)
    .flatMap((date) => groupedData[date].map((takerInfo) => ({ date, ...takerInfo })))
    .sort((a, b) => moment(a.date) - moment(b.date));

  const config = {
    data: resultingData,
    xField: 'takerName',
    yField: 'count',
    isGroup: true,
    isStack: true,
    groupField: 'sinister',
    seriesField: 'sinister',
    legend: { position: 'top' },
    colorField: 'sinister',
    color: ({ sinister }) => {
      switch (sinister) {
        case 'SINISTER':
          return '#ff6c6c';
        case 'NO_SINISTER':
          return '#64daab';
        case 'PROCESSING':
          return '#6395f9';
        case 'UNKNOWN':
          return '#d1d1d1';
        default:
          return 'black';
      }
    },
  };
  return (
    <>
      <Typography.Title level={3}>Insurance results</Typography.Title>
      <Divider />
      <Column {...config} />{' '}
    </>
  );
};
