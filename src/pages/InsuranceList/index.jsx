import { filterByParams, SINISTER_ENUM, sortByParams } from '@/utils/data';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import CustomerInfoTable, { processCustomerData } from './CustomerInfoTable';
import { queryRule } from './service';
import TakerInfoCard from './TakerInfoCard';
import { Card, Col, Row, Spin, Typography } from 'antd';
import GraphSinisterPercent from './GraphSinisterPercent';
import GraphContractsByTakers from './GraphContractsByTakers';
import GraphContractsByDateAndByTakers from './GraphContractsByDateAndByTakers';

const expandedRowRender = (data) => {
  const takerData = data.taker;
  const customerData = processCustomerData(data);

  return (
    <div style={{ padding: '1rem' }}>
      <TakerInfoCard takerData={takerData} />
      <CustomerInfoTable customerData={customerData} />
    </div>
  );
};

const TableList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const actionRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      tip: 'Unique identifier for the insurance',
    },
    {
      title: 'Assured Price',
      dataIndex: 'assuredPrice',
      render: (dom) => <div style={{ textAlign: 'right', paddingRight: '5px' }}>{dom}€</div>,
      sorter: true,
      hideInForm: true,
      width: 128,
    },
    {
      title: 'Contract Date',
      sorter: true,
      dataIndex: 'contractDate',
      valueType: 'dateTime',
    },
    {
      title: 'Start Date',
      sorter: true,
      dataIndex: 'startDate',
      valueType: 'dateTime',
    },
    {
      title: 'Finish Date',
      sorter: true,
      dataIndex: 'finishDate',
      valueType: 'dateTime',
    },
    {
      title: 'Sinister',
      dataIndex: 'sinister',
      filters: true,
      onFilter: true,
      valueEnum: {
        [SINISTER_ENUM.PROCESSING]: {
          text: 'Not done yet',
          status: 'Processing',
        },
        [SINISTER_ENUM.UNKNOWN]: {
          text: 'Unknown',
          status: 'Default',
        },
        [SINISTER_ENUM.NO_SINISTER]: {
          text: 'No sinister',
          status: 'Success',
        },
        [SINISTER_ENUM.SINISTER]: {
          text: 'Sinister',
          status: 'Error',
        },
      },
    },
  ];

  return (
    <PageContainer>
      <Row gutter={6}>
        <Col xs={24} sm={24} md={6} lg={6}>
          <Card style={{ margin: '0.5rem 0' }}>
            {loading ? <Spin /> : <GraphSinisterPercent data={data} />}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={18} lg={18}>
          <Card style={{ margin: '0.5rem 0' }}>
            {loading ? <Spin /> : <GraphContractsByTakers data={data} />}
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ marginBottom: '0.5rem' }}>
            {loading ? <Spin /> : <GraphContractsByDateAndByTakers data={data} />}
          </Card>
        </Col>
      </Row>

      <Card>
        <Typography.Title level={3}>Filters</Typography.Title>
      </Card>
      <ProTable
        headerTitle="Insurances"
        actionRef={actionRef}
        rowKey="key"
        search={{ defaultCollapsed: false, labelWidth: 'auto' }}
        pagination={false}
        expandable={{ expandedRowRender }}
        request={(params, sorter, filter) =>
          queryRule({ ...params, sorter, filter }).then((result) => {
            let dataSource = result.data;
            dataSource = sortByParams(dataSource, sorter);
            dataSource = filterByParams(dataSource, params);

            setData(dataSource);
            return { ...result, data: dataSource };
          })
        }
        // onLoadingChange={(loading) => {
        //   console.log({ loading });
        //   setLoading(loading);
        // }}
        onRow={(_, index) => {
          if (index === data.length - 1) {
            setLoading(false);
          }
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
