import React from 'react';
import { Line } from '@ant-design/charts';
import { Divider, Typography } from 'antd';
import moment from 'moment';

export default ({ data }) => {
  const contractCount = data.map((row) => ({
    date: moment(row.contractDate).format('YYYY-MM-DD'),
    takerId: row.taker.takerId,
    takerName: row.taker.takerFullName,
    count: 1,
  }));

  const groupedData = contractCount.reduce((result, row) => {
    const currentDate = row.date;
    const updatedResult = result;

    updatedResult[currentDate] = updatedResult[currentDate] || [];
    const currentCell = updatedResult[currentDate].find((value) => value.takerId === row.takerId);

    if (currentCell) {
      currentCell.count += 1;
    } else {
      updatedResult[currentDate].push({ takerId: row.takerId, count: 1, takerName: row.takerName });
    }

    return updatedResult;
  }, {});

  const dataPerDateAndTaker = Object.keys(groupedData)
    .flatMap((date) => groupedData[date].map((takerInfo) => ({ date, ...takerInfo })))
    .sort((a, b) => moment(a.date) - moment(b.date));

  const config = {
    data: dataPerDateAndTaker,
    xField: 'date',
    yField: 'count',
    seriesField: 'takerName',
    legend: { position: 'top' },
    point: {
      size: 5,
      shape: 'diamond',
    },
    smooth: true,
    connectNulls: false,
    // animation: {
    //   appear: {
    //     animation: 'path-in',
    //     duration: 1000,
    //   },
    // },
  };
  return (
    <>
      <Typography.Title level={3}>Contracts count per date</Typography.Title>
      <Divider />
      <Line {...config} />
    </>
  );
};
