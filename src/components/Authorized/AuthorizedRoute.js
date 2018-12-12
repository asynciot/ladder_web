import React from 'react';
import { Route, Redirect } from 'dva/router';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, authority,
      redirectPath, isMobile, ...rest } = this.props;
    return (
      <Authorized
        authority={authority}
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
        <Route
          {...rest}
          render={props => (Component ? <Component {...props} isMobile={isMobile} /> : render(props))}
        />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
