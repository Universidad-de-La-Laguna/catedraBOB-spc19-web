// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';
import { v4 as uuidv4 } from 'uuid';

// mock tableListDataSource
const genList = (current, pageSize) => {
  const tableListDataSource = [];
  const takersUids = [uuidv4(), uuidv4(), uuidv4()];
  const takerNames = ['Hotel Piña Bob', 'Hotel Gran Capitán', 'Radazul Hotel Center'];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    const numCustomers = Math.ceil(Math.random() * 6);
    const takerIndex = Math.round(Math.random() * 2);

    tableListDataSource.push({
      key: index,
      disabled: i % 6 === 0,
      id: uuidv4(),
      contractDate: new Date(Math.ceil(Math.random() * 1000000000)).setFullYear(2021),
      startDate: new Date(Math.ceil(Math.random() * 1000000000000)).setFullYear(2021),
      finishDate: new Date(Math.ceil(Math.random() * 1000000000000)).setFullYear(2021),
      assuredPrice: Math.ceil(Math.random() * 3) * 50,
      customers: new Array(numCustomers).fill(0).map((_, i) => ({
        customerId: `customer${i + 1}`,
        customerNif: '12345678H',
        customerFullName: 'My Full Name',
        customerGender: 'MALE',
        customerBirthDate: '2016-08-29T09:12:33.001Z',
        customerTelephone: '555123456',
        customerEmail: 'myemail@example.com',
        negativePcrDate: '2016-08-29T09:12:33.001Z',
        negativePcrHash: 'a3b5543998381d38ee72e2793488d1714c3f8d90f4bda632a411cb32f793bf0a',
      })),
      taker: {
        takerId: takersUids[takerIndex],
        takerNif: '12345678H',
        takerFullName: takerNames[takerIndex],
        takerContactAddress: 'Example Street, 1',
        takerContactPostalCode: '38001',
        takerContactTown: 'My town',
        takerContactLocation: 'My location',
        takerContactTelephone: '555123456',
        takerContactMobile: '646123456',
        takerContactEmail: 'taker@example.com',
        takerIBAN: 'ES2712345678901234567890',
      },
      pcrRequests: new Array(numCustomers).fill(0).map((_, i) => ({
        result: ['POSITIVE', 'NEGATIVE', 'UNKNOWN', null][Math.round(Math.random() * 3)],
        customerId: `customer${i + 1}`,
        requestDate: '2016-08-29T09:12:33.001Z',
        resultDate: null,
        id: '562b2dd8-5a4f-11eb-ae93-0242ac130002',
      })),
    });
  }

  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...tableListDataSource];

  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };
  return res.json(result);
}

export default {
  'GET /api/insurances': getRule,
};
