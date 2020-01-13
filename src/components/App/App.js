import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import React, { Component, Suspense } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Header from 'components/Header/Header';
import ToastDrawer from 'components/ToastDrawer/ToastDrawer';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import { actions as appActions } from 'reducers/application';
import {
  Calculator,
  Favorites,
  Flavors,
  FlavorStash,
  Home,
  Login,
  NotFound,
  Profile,
  Recipe,
  Recipes,
  Register,
  ShoppingList,
  UserRecipes,
  UserSettings
} from 'pages';

export class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { actions } = this.props;

    actions.initApp();
  }

  render() {
    return (
      <Suspense fallback={<Spinner variant="primary" />}>
        <Helmet defaultTitle="MixNJuice" titleTemplate="MixNJuice - %s" />
        <Header />
        <ToastDrawer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/recipes" component={Recipes} />
          <Route exact path="/calculator" component={Calculator} />
          <Route exact path="/flavors" component={Flavors} />
          <Route exact path="/recipe" component={Recipe} />
          <PrivateRoute exact path="/user/profile" component={Profile} />
          <PrivateRoute exact path="/user/recipes" component={UserRecipes} />
          <PrivateRoute exact path="/user/favorites" component={Favorites} />
          <PrivateRoute
            exact
            path="/user/flavor-stash"
            component={FlavorStash}
          />
          <PrivateRoute
            exact
            path="/user/shopping-list"
            component={ShoppingList}
          />
          <PrivateRoute exact path="/user/settings" component={UserSettings} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...appActions
    },
    dispatch
  )
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(App)
);
