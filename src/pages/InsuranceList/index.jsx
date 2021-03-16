import { filterByParams, SINISTER_ENUM, sortByParams } from '@/utils/data';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import CustomerInfoTable, { processCustomerData } from './CustomerInfoTable';
import { queryRule } from './service';
import TakerInfoCard from './TakerInfoCard';
import { Card, Col, Row, Spin } from 'antd';
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
      sorter: true,
      hideInForm: true,
    },
    {
      title: 'contractDate',
      sorter: true,
      dataIndex: 'contractDate',
      valueType: 'dateTime',
    },
    {
      title: 'startDate',
      sorter: true,
      dataIndex: 'startDate',
      valueType: 'dateTime',
    },
    {
      title: 'finishDate',
      sorter: true,
      dataIndex: 'finishDate',
      valueType: 'dateTime',
    },
    {
      title: 'sinister',
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
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card style={{ margin: '1rem 0' }}>
            {loading ? <Spin /> : <GraphSinisterPercent data={data} />}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card style={{ margin: '1rem 0' }}>
            {loading ? <Spin /> : <GraphContractsByTakers data={data} />}
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ margin: '1rem 0' }}>
            {loading ? <Spin /> : <GraphContractsByDateAndByTakers data={data} />}
          </Card>
        </Col>
      </Row>

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
