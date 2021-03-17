import { SINISTER_ENUM } from '@/utils/data';
import { Liquid } from '@ant-design/charts';
import { Divider, Typography } from 'antd';

export default ({ data }) => {
  const sumSinisters = data.reduce(
    (result, current) => result + (current.sinister === SINISTER_ENUM.SINISTER),
    0,
  );
  const percentSinisters = sumSinisters / data.length;

  // Gauge chart:
  // const config = {
  //   percent: percentSinisters,
  //   range: { color: 'l(0) 0:#ffbdbd 1:#ff6c6c' },
  //   startAngle: Math.PI,
  //   endAngle: 2 * Math.PI,
  //   indicator: null,
  //   statistic: {
  //     title: {
  //       offsetY: -36,
  //       style: {
  //         fontSize: '36px',
  //         color: '#4B535E',
  //       },
  //       formatter: () => (isNaN(percentSinisters) ? '...' : `${percentSinisters * 100}%`),
  //     },
  //     content: {
  //       style: {
  //         fontSize: '24px',
  //         lineHeight: '44px',
  //         color: '#4B535E',
  //       },
  //       formatter: () => '% Siniestros',
  //     },
  //   },
  // };

  const config = {
    percent: percentSinisters,
    color: '#ff6c6c',
    statistic: {
      content: {
        style: {
          fontSize: 32,
          fill: 'black',
          lineHeight: 1,
        },
      },
    },
  };

  return (
    <>
      <Typography.Title level={3}>% Sinisters</Typography.Title>
      <Divider />
      <Liquid {...config} />
    </>
  );
};
