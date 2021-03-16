import ProTable from '@ant-design/pro-table';
import React from 'react';

export const processCustomerData = (data) => {
  return data.customers.map((customer) => {
    const pcrRequest = data.pcrRequests.find(
      (request) => request.customerId === customer.customerId,
    );

    return {
      ...customer,
      endingPcrId: pcrRequest.id,
      endingPcrRequestDate: pcrRequest.requestDate,
      endingPcrResultDate: pcrRequest.resultDate,
      endingPcrResult: pcrRequest.result,
    };
  });
};

export default ({ customerData }) => (
  <ProTable
    columns={[
      // {
      //   title: 'Customer ID',
      //   dataIndex: 'customerId',
      // },
      {
        title: 'NIF',
        dataIndex: 'customerNif',
      },
      {
        title: 'Name',
        dataIndex: 'customerFullName',
      },
      {
        title: 'Gender',
        dataIndex: 'customerGender',
      },
      {
        title: 'Birthday',
        dataIndex: 'customerBirthDate',
        valueType: 'date',
        sorter: true,
      },
      {
        title: 'Phone',
        dataIndex: 'customerTelephone',
      },
      {
        title: 'E-mail',
        dataIndex: 'customerEmail',
        copyable: true,
        ellipsis: true,
      },
      {
        title: 'Negative PCR Date',
        dataIndex: 'negativePcrDate',
        valueType: 'date',
        sorter: true,
      },
      // {
      //   title: 'Negative PCR Hash',
      //   dataIndex: 'negativePcrHash',
      // },
      // endingPcrId: pcrRequest.id,
      // endingPcrRequestDate: pcrRequest.requestDate,
      // endingPcrResultDate: pcrRequest.resultDate,
      // endingPcrResult: pcrRequest.result,
      {
        title: 'Ending PCR ID',
        dataIndex: 'endingPcrId',
        copyable: true,
        ellipsis: true,
      },
      {
        title: 'Ending PCR Request Date',
        dataIndex: 'endingPcrRequestDate',
        valueType: 'datetime',
        sorter: true,
      },
      {
        title: 'Ending PCR Result Date',
        dataIndex: 'endingPcrResultDate',
        valueType: 'datetime',
        sorter: true,
      },
      {
        title: 'Ending PCR Result',
        dataIndex: 'endingPcrResult',
      },
    ]}
    headerTitle="Customer Info"
    rowKey="customerId"
    search={false}
    options={false}
    dataSource={customerData}
    pagination={false}
    cardBordered={true}
  />
);
