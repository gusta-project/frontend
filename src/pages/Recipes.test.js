import React from 'react';
import renderer from 'react-test-renderer';

import { Recipes } from './Recipes';
import recipeList from '../data/recipes.json';

jest.mock('react-bootstrap', () => ({
  ...jest.requireActual('react-bootstrap'),
  OverlayTrigger: require('utils/testing').mockComponent('OverlayTrigger')
}));

describe('<Recipes />', () => {
  const actions = {
    registerUser: jest.fn(),
    popToast: jest.fn(),
    requestRecipes: jest.fn()
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <Recipes actions={actions} recipes={recipeList} />
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('handles favorite clicks', () => {
    const component = renderer.create(
      <Recipes actions={actions} recipes={recipeList} />
    );

    const { instance } = component.root.findByType(Recipes);

    expect(instance).toBeDefined();
    instance.handleFavoriteClick(0, 'Wyona Street Dogspa');
    expect(instance.state.recipes[0]).toBeDefined();
    expect(instance.state.recipes[0]).toEqual({
      favorited: true,
      favoriteIcon: ['fas', 'heart']
    });

    instance.handleFavoriteClick(0, 'Wyona Street Dogspa');
    expect(instance.state.recipes[0]).toEqual({
      favorited: false,
      favoriteIcon: ['far', 'heart']
    });
  });

  it('handles view toggle', () => {
    const component = renderer.create(
      <Recipes actions={actions} recipes={recipeList} />
    );

    const { instance } = component.root.findByType(Recipes);

    expect(instance).toBeDefined();
    expect(instance.state.grid).toEqual(true);

    instance.handleViewToggle();
    expect(instance.state.grid).toEqual(false);
  });
});
