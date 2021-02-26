import React from 'react';
import { Alert } from 'antd';
import { useIntl } from 'umi';

export const AlertInvalidNumberPeople = ({ numPeople, numNegativePCR }) => {
  const { formatMessage } = useIntl();

  if (numPeople < 1) {
    return (
      <Alert
        message={formatMessage({
          id: 'pages.newInsurance.people.noPeopleErrorMessage',
          defaultMessage: 'Error: invalid number of people selected',
        })}
        type="error"
        showIcon
      />
    );
  }

  if (numPeople !== numNegativePCR) {
    return (
      <Alert
        message={formatMessage(
          {
            id: 'pages.newInsurance.people.noPeopleErrorMessage',
            defaultMessage:
              'Invalid number of PCRs. There are {numPeople} persons in the contract. And {numNegativePCR} negative PCRs were provided',
          },
          { numPeople, numNegativePCR },
        )}
        type="error"
        showIcon
      />
    );
  }

  return null;
};
