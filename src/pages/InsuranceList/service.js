import { SINISTER_ENUM } from '@/utils/data';
import request from '@/utils/request';

function computeSinister(pcrRequests) {
  if (pcrRequests.some((pcrRequest) => pcrRequest.result === 'POSITIVE')) {
    return SINISTER_ENUM.SINISTER;
  }
  if (pcrRequests.every((pcrRequest) => pcrRequest.result === 'NEGATIVE')) {
    return SINISTER_ENUM.NO_SINISTER;
  }
  if (pcrRequests.some((pcrRequest) => pcrRequest.result === 'UNKNOWN')) {
    return SINISTER_ENUM.UNKNOWN;
  }

  return SINISTER_ENUM.PROCESSING;
}

export async function queryInsurances({ token, apiBaseUri }) {
  const result = await request(`${apiBaseUri}/insurances`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log({ result });
  window.spcResult = result;

  return {
    data: result.map((insurance) => ({
      ...insurance,
      sinister: computeSinister(insurance.pcrRequests),
    })),
  };
}

export async function cancelPcrRequest({ token, apiBaseUri, insuranceId, pcrRequestId }) {
  const result = await fetch(`${apiBaseUri}/insurance/${insuranceId}/pcrRequests/${pcrRequestId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return result;
}

export async function requestPcr({ token, apiBaseUri, insuranceId, pcrRequestId, customerId }) {
  const result = await fetch(`${apiBaseUri}/insurance/${insuranceId}/pcrRequests`, {
    method: 'POST',
    body: JSON.stringify({
      id: pcrRequestId,
      customerId,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return result;
}
