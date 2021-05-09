import { CloseOutlined, RetweetOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Tooltip } from 'antd';
import React from 'react';

export const processCustomerData = (data) => {
  return data.customers.map((customer) => {
    const pcrRequest = data.pcrRequests.find(
      (request) => request.customerId === customer.customerId,
    );

    return {
      ...customer,
      endingPcrId: pcrRequest?.id,
      endingPcrRequestDate: pcrRequest?.requestDate,
      endingPcrResultDate: pcrRequest?.resultDate,
      endingPcrResult: pcrRequest?.result,
    };
  });
};

export default ({ onPcrRequestCancel, onNewPcrRequest, customerData }) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <ProTable
      columns={[
        {
          title: 'Customer ID',
          dataIndex: 'customerId',
          copyable: true,
          ellipsis: true,
        },
        {
          title: 'Negative PCR Date',
          dataIndex: 'negativePcrDate',
          valueType: 'date',
          sorter: true,
        },
        {
          title: 'Ending PCR ID',
          dataIndex: 'endingPcrId',
          copyable: true,
          ellipsis: true,
        },
        {
          title: 'Ending PCR Request Date',
          dataIndex: 'endingPcrRequestDate',
          valueType: 'dateTime',
          sorter: true,
        },
        {
          title: 'Ending PCR Result Date',
          dataIndex: 'endingPcrResultDate',
          valueType: 'dateTime',
          sorter: true,
        },
        {
          title: 'Ending PCR Result',
          dataIndex: 'endingPcrResult',
          valueEnum: {
            UNKNOWN: {
              text: 'Unknown',
              status: 'Default',
            },
            NEGATIVE: {
              text: 'Negative',
              status: 'Success',
            },
            POSITIVE: {
              text: 'Positive',
              status: 'Error',
            },
          },
        },
        {
          title: 'PCR Request',
          valueType: 'option',
          render: (text, record, _, action) => [
            <div>
              <Tooltip placement="top" title="Cancel PCR request">
                <Button
                  type="danger"
                  size="large"
                  loading={loading}
                  icon={<CloseOutlined />}
                  onClick={async () => {
                    setLoading(true);
                    await onPcrRequestCancel(record.endingPcrId);
                    setLoading(false);
                  }}
                ></Button>
              </Tooltip>
              <Tooltip placement="top" title="New  PCR request">
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  icon={<RetweetOutlined />}
                  onClick={async () => {
                    setLoading(true);
                    await onNewPcrRequest(record.endingPcrId, record.customerId);
                    setLoading(false);
                  }}
                ></Button>
              </Tooltip>
            </div>,
          ],
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
};
