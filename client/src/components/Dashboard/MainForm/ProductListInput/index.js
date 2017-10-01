import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Segment, Divider, Header, Icon, Dropdown } from 'semantic-ui-react';
import * as actions from '../../../../actions';
import uuid from 'uuid';
import AddProductComponent from './AddProductComponent';
import InputNumber from './InputNumber';
import _ from 'lodash';
import './styles.css'

class ProductListInput extends Component {

  addProductItem(data) {
    const {products: lastProducts} = this.props.emailForm;
    const newProducts = lastProducts.concat({
      name: data.productValue,
      amount: data.amountValue
    });
    this.props.formDataActions.changeProducts(newProducts);
  }

  getProductFullname(product) {
    return product.id + '-' + product.name;
  }

  handleKeyPressOnAddComponent(e, data) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addProductItem(data);
    }
  }

  filteredProductsForAddComponent(products) {
    console.log('--------------------------');
    return products.filter((product) => {
      return !_.includes(this.props.emailForm.products, {
        name: product.text
      });
    });
  }

  updateAmount(e, data) {}

  renderList() {
    const productNames = this.props.dataBinded.products.map((product) => {
      return {
        key: uuid(),
        value: this.getProductFullname(product),
        text: this.getProductFullname(product)
      };
    });

    let ui_items = [];
    const {products} = this.props.emailForm;
    for (let i = 0; i < this.props.emailForm.products.length; i++) {
      const productName = products[i].name;
      const productAmount = products[i].amount;
      ui_items.push(
        <Grid.Column width={ 16 }>
          <Segment color='blue'>
            <Grid.Row>
              <Grid.Column width={ 12 }>
                <Dropdown key={ i } placeholder='Product' value={ productName } fluid search selection options={ productNames } size='big' />
              </Grid.Column>
              <Grid.Column width={ 4 }>
                <InputNumber value={ productAmount } key={ i } onChange={ this.updateAmount.bind(this) } />
              </Grid.Column>
            </Grid.Row>
          </Segment>
        </Grid.Column>
      );
    }

    return ui_items;
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Divider hidden/>
            <Divider/>
            <Divider horizontal>
              <Header block textAlign='center' as='h3' color='blue'>
                <Icon name='shop' />
                <Header.Content>Products</Header.Content>
              </Header>
            </Divider>
          </Grid.Row>
          { this.renderList() }
          <AddProductComponent onKeyPress={ this.handleKeyPressOnAddComponent.bind(this) } onFilled={ this.addProductItem.bind(this) } filterProducts={ this.filteredProductsForAddComponent.bind(this) } />
        </Grid>
      </div>
      );
  }
}




const mapStateToProps = ({dataBinded, emailForm}) => {
  return {
    dataBinded,
    emailForm,
  }
};

const mapActionsToProps = (dispatch) => {
  return {
    dataActions: bindActionCreators(actions.dataActions, dispatch),
    formDataActions: bindActionCreators(actions.formDataActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(ProductListInput));