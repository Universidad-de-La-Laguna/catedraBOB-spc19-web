import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';

class SecurityLayout extends React.Component {
  render() {
    const { children, loading, loginStatus } = this.props;
    // You can replace it to your authentication rule (such as check token exists)

    const isLogin = !!loginStatus;
    const queryString = stringify({ redirect: window.location.href });

    if (!isLogin && loading) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading, login }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  loginStatus: login.status,
}))(SecurityLayout);
