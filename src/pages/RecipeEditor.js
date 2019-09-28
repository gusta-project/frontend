import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Col, Container, InputGroup, Form, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { Form as FinalForm } from 'react-final-form';

import { actions as recipeActions } from 'reducers/recipe';
import SplitSlider from 'components/SplitSlider/SplitSlider';
import FlavorBrowser from 'components/FlavorBrowser/FlavorBrowser';
import IngredientBar from 'components/IngredientBar/IngredientBar';
import RecipeComponents from 'components/RecipeComponents/RecipeComponents';
import IngredientList from 'components/IngredientList/IngredientList';
import {
  getActiveRecipe,
  getNicotineStrength,
  getDesiredNicotineStrength,
  getDesiredVolume,
  getNicotineDiluentRatio,
  getDesiredDiluentRatio
} from 'selectors/recipe';

export class RecipeEditor extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      setRecipeName: PropTypes.func.isRequired,
      setDesiredVolume: PropTypes.func.isRequired,
      setNicotineStrength: PropTypes.func.isRequired,
      setDesiredDiluentRatio: PropTypes.func.isRequired,
      setNicotineDiluentRatio: PropTypes.func.isRequired,
      setDesiredNicotineStrength: PropTypes.func.isRequired
    }).isRequired,
    recipe: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
      percentages: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    nicotineStrength: PropTypes.number.isRequired,
    desiredNicotineStrength: PropTypes.number.isRequired,
    desiredVolume: PropTypes.number.isRequired,
    desiredDiluentRatio: PropTypes.number.isRequired,
    nicotineDiluentRatio: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  hasIngredient(event) {
    const {
      recipe: { ingredients }
    } = this.props;
    const {
      target: { name }
    } = event;

    return ingredients.find(ingredient => ingredient.id === name) !== undefined
      ? 'disabled'
      : null;
  }

  handleUserCheck(e) {
    const name = e.target.name;

    if (this.state[name] === true) {
      this.setState({ [name]: false });
    } else {
      this.setState({ [name]: true });
    }
  }

  handleUserInput(event) {
    const { actions } = this.props;
    const {
      target: { name, value }
    } = event;

    switch (name) {
      case 'name':
        actions.setRecipeName(value);
        break;
      case 'desiredVolume': {
        const volume = parseInt(value, 10);

        if (volume !== false) {
          actions.setDesiredVolume(volume);
        }
        break;
      }
      case 'nicotineStrength': {
        const strength = parseInt(value, 10);

        if (strength !== false) {
          actions.setNicotineStrength(strength);
        }
        break;
      }
      case 'desiredNicotineStrength': {
        const strength = parseInt(value, 10);

        if (strength !== false) {
          actions.setDesiredNicotineStrength(strength);
        }
        break;
      }
      case 'nicotineDiluentRatio': {
        const ratio = parseFloat(value / 100);

        if (ratio !== false) {
          actions.setNicotineDiluentRatio(ratio);
        }
        break;
      }
      case 'desiredDiluentRatio': {
        const ratio = parseFloat(value / 100);

        if (ratio !== false) {
          actions.setDesiredDiluentRatio(ratio);
        }
        break;
      }
      default:
        return;
    }
  }

  handleSubmit(event) {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ validated: true });
  }

  get percentages() {
    const {
      desiredVolume,
      desiredNicotineStrength,
      nicotineStrength,
      desiredDiluentRatio,
      nicotineDiluentRatio,
      recipe: { percentages }
    } = this.props;

    let flavorPercent = 0;

    if (percentages.length > 0) {
      flavorPercent = percentages.reduce((acc, curr) => {
        return acc + curr.millipercent / 100;
      }, 0);
    }

    // determine how many mg of nicotine we need
    const nicotineMg = desiredNicotineStrength * desiredVolume;
    // determine how many ml of nicotine base we need
    const baseNicotineMl = nicotineMg / nicotineStrength;
    // calculate the percentage of the final mix that will be nicotine
    const nicotinePercent = baseNicotineMl / desiredVolume;
    // determine how much of that is VG
    const nicotineVgPercent = nicotinePercent * nicotineDiluentRatio;
    const nicotinePgPercent = nicotinePercent * (1 - nicotineDiluentRatio);
    // figure out the remaining amounts of VG and PG
    const remainingVgPercent = Math.max(
      0,
      desiredDiluentRatio - nicotineVgPercent
    );
    const remainingPgPercent = Math.max(
      0,
      1 - desiredDiluentRatio - flavorPercent - nicotinePgPercent
    );

    return {
      nicotine: nicotinePercent * 100,
      flavor: flavorPercent * 100,
      vg: remainingVgPercent * 100,
      pg: remainingPgPercent * 100
    };
  }

  get components() {
    const { percentages } = this;
    const {
      desiredVolume,
      nicotineStrength,
      desiredNicotineStrength,
      nicotineDiluentRatio,
      recipe: { ingredients, percentages: ingredientPercentages }
    } = this.props;

    const densities = {
      vg: 1.26,
      pg: 1.038,
      vgNic: 1.235,
      pgNic: 1.035
    };
    const result = [];

    // linear interpolation between pure VG and pure PG nic densities
    const nicotineDensity =
      (1 - nicotineDiluentRatio) * densities.pgNic +
      nicotineDiluentRatio * densities.vgNic;
    // determine how many mg of nicotine we need
    const nicotineMg = desiredNicotineStrength * desiredVolume;
    // determine how many ml of nicotine base we need
    const nicotineMl = nicotineMg / nicotineStrength;
    const nicotineGrams = nicotineMl * nicotineDensity;
    const vgMl = (percentages.vg / 100) * desiredVolume;
    const vgGrams = vgMl * densities.vg;
    const pgMl = (percentages.pg / 100) * desiredVolume;
    const pgGrams = pgMl * densities.pg;

    result.push({
      name: `${nicotineStrength} mg/ml nicotine`,
      percentage: percentages.nicotine,
      mililiters: nicotineMl,
      grams: nicotineGrams
    });

    result.push({
      name: 'Vegetable glycerin',
      percentage: percentages.vg,
      mililiters: vgMl,
      grams: vgGrams
    });

    result.push({
      name: 'Propylene glycol',
      percentage: percentages.pg,
      mililiters: pgMl,
      grams: pgGrams
    });

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const percentage = ingredientPercentages[i];
      const name = `${ingredient.Flavor.Vendor.code} ${ingredient.Flavor.name}`;

      result.push({
        name,
        percentage,
        mililiters: 0,
        grams: 0
      });
    }

    return result;
  }

  render() {
    const {
      recipe,
      desiredVolume,
      desiredNicotineStrength,
      nicotineStrength,
      nicotineDiluentRatio,
      desiredDiluentRatio,
      recipe: { percentages: ingredientPercentages }
    } = this.props;
    const { percentages, components } = this;
    const { name: recipeName, ingredients } = recipe;

    return (
      <Container className="recipe-editor">
        <Helmet title="Recipe Editor" />
        <FinalForm
          onSubmit={this.handleSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col md="6">
                  <h2>Basic Info</h2>
                  <Form.Row>
                    <Form.Group as={Col} md="12" controlId="name">
                      <Form.Label>Recipe Name</Form.Label>
                      <Form.Control
                        name="name"
                        type="text"
                        value={recipeName}
                        onChange={this.handleUserInput}
                        placeholder="Recipe Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please choose a recipe name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <h2>Preparation</h2>
                  <Form.Row>
                    <Form.Group as={Col} md="4" controlId="desiredVolume">
                      <Form.Label>Batch Amount</Form.Label>
                      <InputGroup>
                        <Form.Control
                          name="desiredVolume"
                          type="number"
                          value={desiredVolume}
                          onChange={this.handleUserInput}
                          placeholder="0"
                          required
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="amount-unit">mL</InputGroup.Text>
                        </InputGroup.Append>
                        <Form.Control.Feedback type="invalid">
                          Please provide a batch amount.
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="4" controlId="nicotineStrength">
                      <Form.Label>Base Strength</Form.Label>
                      <InputGroup>
                        <Form.Control
                          name="nicotineStrength"
                          type="number"
                          value={nicotineStrength}
                          onChange={this.handleUserInput}
                          placeholder="0"
                          required
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="amount-unit">
                            mg/mL
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="8">
                      <Form.Label>Nicotine VG/PG ratio</Form.Label>
                      <SplitSlider
                        name="nicotineDiluentRatio"
                        initialValue={nicotineDiluentRatio * 100}
                        onChange={this.handleUserInput}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="desiredNicotineStrength"
                    >
                      <Form.Label>Desired Strength</Form.Label>
                      <InputGroup>
                        <Form.Control
                          name="desiredNicotineStrength"
                          type="number"
                          value={desiredNicotineStrength}
                          onChange={this.handleUserInput}
                          placeholder="0"
                          required
                        />
                        <InputGroup.Append>
                          <InputGroup.Text id="amount-unit">
                            mg/mL
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="8">
                      <Form.Label>Desired VG/PG ratio</Form.Label>
                      <SplitSlider
                        name="desiredDiluentRatio"
                        initialValue={desiredDiluentRatio * 100}
                        onChange={this.handleUserInput}
                      />
                    </Form.Group>
                  </Form.Row>
                </Col>
                <Col md="6">
                  <Container>
                    <Row>
                      <Col md="6" sm="3">
                        <h2>Flavor Stash</h2>
                      </Col>
                      <FlavorBrowser />
                    </Row>
                    <Row></Row>
                    <Row>
                      <Col md="12">
                        <h2>Ingredients</h2>
                        <IngredientList
                          ingredients={ingredients}
                          percentages={ingredientPercentages}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <RecipeComponents components={components} />
                </Col>
                <Col md="12">
                  <IngredientBar {...percentages} />
                </Col>
              </Row>
              <Row>
                <Col md="12" className="border-top pt-2 text-right">
                  <Button
                    variant="danger"
                    className="button-animation mr-2"
                    type="submit"
                  >
                    <span>Delete</span>
                  </Button>
                  <Button className="button-animation" type="submit">
                    <span>Save</span>
                  </Button>
                </Col>
              </Row>
            </form>
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  recipe: getActiveRecipe(state),
  nicotineStrength: getNicotineStrength(state),
  desiredNicotineStrength: getDesiredNicotineStrength(state),
  desiredVolume: getDesiredVolume(state),
  nicotineDiluentRatio: getNicotineDiluentRatio(state),
  desiredDiluentRatio: getDesiredDiluentRatio(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(recipeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeEditor);
