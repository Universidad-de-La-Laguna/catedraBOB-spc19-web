import { filterByParams, processInsurances, SINISTER_ENUM, sortByParams } from '@/utils/data';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import CustomerInfoTable, { processCustomerData } from './CustomerInfoTable';
import { queryInsurances, cancelPcrRequest, requestPcr } from './service';
import TakerInfoCard from './TakerInfoCard';
import { Card, Col, Row, Spin, Typography, notification, Input } from 'antd';
import { connect, history } from 'umi';
import GraphSinisterPercent from './GraphSinisterPercent';
import GraphContractsByTakers from './GraphContractsByTakers';
import GraphContractsByDateAndByTakers from './GraphContractsByDateAndByTakers';

const TableList = ({ token, apiBaseUri }) => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idFilter, setIdFilter] = useState(history.location.query.id);
  const actionRef = useRef();

  const expandedRowRender = (data) => {
    const takerData = data.taker;
    const customerData = processCustomerData(data);

    const onPcrRequestCancel = async (pcrRequestId) => {
      const response = await cancelPcrRequest({
        token,
        apiBaseUri,
        insuranceId: data.id,
        pcrRequestId,
      });

      if (response.ok) {
        notification.success({
          message: 'PCR request canceled successfully',
        });
      } else {
        const error = await response.json();
        notification.error({
          message: `Error ${error?.code || ''}`,
          description: `Message: ${error?.message}`,
        });
      }
    };

    const onNewPcrRequest = async (pcrRequestId, customerId) => {
      const response = await requestPcr({
        token,
        apiBaseUri,
        insuranceId: data.id,
        pcrRequestId,
        customerId,
      });

      if (response.ok) {
        notification.success({
          message: 'Created new PCR request successfully',
        });
      } else {
        notification.error({
          message: 'Error creating PCR request',
        });
      }
    };

    return (
      <div style={{ padding: '1rem' }}>
        <TakerInfoCard takerData={takerData} />
        <CustomerInfoTable
          onPcrRequestCancel={onPcrRequestCancel}
          onNewPcrRequest={onNewPcrRequest}
          customerData={customerData}
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      tip: 'Unique identifier for the insurance',
      fieldProps: {
        value: idFilter,
        onChange: (e) => setIdFilter(e.target.value),
      },
    },
    {
      title: 'Taker name',
      dataIndex: 'takerName',
      ellipsis: true,
    },
    {
      title: 'Assured Price',
      dataIndex: 'assuredPrice',
      render: (dom) => <div style={{ textAlign: 'right', paddingRight: '5px' }}>{dom}€</div>,
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      width: 128,
    },
    {
      title: 'Estimated Compensation',
      dataIndex: 'sinisterCompensation',
      render: (dom) => <div style={{ textAlign: 'right', paddingRight: '5px' }}>{dom}€</div>,
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      width: 128,
    },
    {
      title: 'Contract Date',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'contractDate',
      valueType: 'dateTime',
    },
    {
      title: 'Start Date',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'startDate',
      valueType: 'dateTime',
    },
    {
      title: 'Finish Date',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'finishDate',
      valueType: 'dateTime',
    },
    {
      title: 'Sinister',
      dataIndex: 'sinister',
      filters: true,
      onFilter: true,
      hideInSearch: true,
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
            {loading ? <Spin /> : <GraphSinisterPercent data={filteredData} />}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={18} lg={18}>
          <Card style={{ margin: '0.5rem 0' }}>
            {loading ? <Spin /> : <GraphContractsByTakers data={filteredData} />}
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ marginBottom: '0.5rem' }}>
            {loading ? <Spin /> : <GraphContractsByDateAndByTakers data={filteredData} />}
          </Card>
        </Col>
      </Row>

      <Card>
        <Typography.Title level={3}>Filters</Typography.Title>
      </Card>
      <ProTable
        headerTitle="Insurances"
        actionRef={actionRef}
        rowKey="id"
        search={{ defaultCollapsed: false, labelWidth: 'auto' }}
        pagination={false}
        expandable={{ expandedRowRender }}
        params={{ id: idFilter }}
        options={{
          reload: () => {
            setOriginalData([]);
            setFilteredData([]);
            actionRef.current.reload();
          },
        }}
        onReset={() => {
          setIdFilter(null);
        }}
        request={async (params, sorter, filter) => {
          setLoading(true);
          let result = { data: originalData };

          if (originalData.length === 0) {
            result = await queryInsurances({ token, apiBaseUri });
            setOriginalData(result.data);
          }

          let dataSource = processInsurances(result.data);
          dataSource = sortByParams(dataSource, sorter);
          dataSource = filterByParams(dataSource, params);

          setFilteredData(dataSource);

          if (dataSource.length === 0) {
            setLoading(false);
          }

          return { ...result, data: dataSource };
        }}
        onRow={(_, index) => {
          if (index === filteredData.length - 1) {
            setLoading(false);
          }
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ login }) => ({
  token: login.token,
  apiBaseUri: login.apiBaseUri,
}))(TableList);
