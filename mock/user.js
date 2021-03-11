const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req, res) {
  await waitTime(2000);
  return res.json('captcha-xxx');
} // The code will be compatible with the local service mock and the static data of the deployment site

export default {
  'GET /api/currentUser': {
    name: 'Fulanito',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'jose@luis.es',
    signature: 'Signature',
    title: 'Profesor',
    group: 'group1',
    tags: [
      {
        key: '0',
        label: 'label 0',
      },
      {
        key: '1',
        label: 'label 1',
      },
      {
        key: '2',
        label: 'label 2',
      },
      {
        key: '3',
        label: 'label 3',
      },
      {
        key: '4',
        label: 'label 4',
      },
      {
        key: '5',
        label: 'label 5',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: 'Santa Cruz de Tenerife',
        key: '330000',
      },
      city: {
        label: 'Santa Cruz de Tenerife',
        key: '330100',
      },
    },
    address: 'Avenida de la Piruleta, nº 33, Santa Cruz de Tenerife',
    phone: '+34123456789',
  },
  // GET POST can be omitted
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': async (req, res) => {
    const { password, userName, type } = req.body;
    await waitTime(2000);

    if (password === 'pass' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJVTEwifQ.OiehqHgx47KQqybnFhi3lFqooeFU4b_hfub_f5XcH6A',
      });
      return;
    }

    if (password === 'pass' && userName === 'taker') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'taker',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoidGFrZXIiLCJpc3MiOiJVTEwifQ.kBqHISpWyPbW5uNnadqCe4BlwyGbULrJHRGv0V-VLQ4',
      });
      return;
    }

    if (password === 'pass' && userName === 'insurer') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'insurer',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiaW5zdXJlciIsImlzcyI6IlVMTCJ9.xrJqsSp4lIp-rI4iHhYcPZnHqgMoa8BUgE-AJWNHTR4',
      });
      return;
    }

    if (password === 'pass' && userName === 'lab') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'lab',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoibGFib3JhdG9yeSIsImlzcyI6IlVMTCJ9.Y0_Sn23eqGutg-fsbIURb9xpSSEtmwPBMXX_JSrvAvw',
      });
      return;
    }

    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'admin',
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
