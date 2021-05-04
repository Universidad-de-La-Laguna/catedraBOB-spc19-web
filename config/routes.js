export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin', 'taker', 'insurer', 'lab'],
              },
              {
                path: '/lab/insurance/:insuranceId/pcr/:pcrId/contract/:contractAddress',
                component: './PcrResult',
                name: 'Set PCR',
                icon: 'Send',
                authority: ['admin', 'lab'],
              },
              {
                path: '/new',
                name: 'New Insurance',
                icon: 'form',
                component: './NewInsurance',
                authority: ['admin', 'taker'],
              },
              {
                path: '/insurances',
                name: 'Insurances',
                icon: 'UnorderedListOutlined',
                component: './InsuranceList',
                authority: ['admin', 'taker', 'insurer'],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
