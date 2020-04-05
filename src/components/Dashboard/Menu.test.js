import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import { initialState } from 'reducers/dashboard';
import ConnectedMenu from './Menu';
import { withMemoryRouter } from 'utils/testing';

jest.mock('components/Pagination/Pagination', () => {
  const pagination = require('utils/testing').mockComponent('Pagination');

  return {
    withPagination: () => () => pagination,
    pagination
  };
});

describe('Dashboard <Menu />', () => {
  const mockStore = configureStore();
  const store = mockStore({ dashboard: initialState });
  const RoutedMenu = withMemoryRouter(ConnectedMenu);

  it('renders correctly', () => {
    expect(
      renderer
        .create(
          <Provider store={store}>
            <RoutedMenu />
          </Provider>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
