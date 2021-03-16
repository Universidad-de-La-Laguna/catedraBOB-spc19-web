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

export async function queryRule(params) {
  return request('/api/insurances', { params }).then((result) => ({
    ...result,
    data: result.data.map((insurance) => ({
      ...insurance,
      sinister: computeSinister(insurance.pcrRequests),
    })),
  }));
}
// export async function removeRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: { ...params, method: 'delete' },
//   });
// }
// export async function addRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: { ...params, method: 'post' },
//   });
// }
// export async function updateRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: { ...params, method: 'update' },
//   });
// }
