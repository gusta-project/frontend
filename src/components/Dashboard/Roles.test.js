import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import { initialState } from 'reducers/roles';
import { initialState as dashboardInitialState } from 'reducers/dashboard';
import ConnectedRoles from './Roles';
import { withMemoryRouter } from 'utils';

describe('Dashboard <Roles />', () => {
  const defaultLayoutOptions = {
    border: false,
    header: true,
    title: false,
    style: {}
  };
  const mockStore = configureStore();
  const store = mockStore({
    roles: initialState,
    dashboard: dashboardInitialState
  });

  const RoutedRoles = withMemoryRouter(ConnectedRoles);

  it('renders correctly', () => {
    expect(
      renderer
        .create(
          <Provider store={store}>
            <RoutedRoles layoutOptions={defaultLayoutOptions} />
          </Provider>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
