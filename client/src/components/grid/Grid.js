
import Relay from 'react-relay';
import React, { Component, PropTypes } from 'react';

import style from './style';

class Grid extends Component {

  static propTypes = {
    dinosaurs: PropTypes.array
  }

  render() {
    console.log(this.props);
    return (
      <div className={style.gridContainer}>
        <h2>GRID</h2>
        <div>{this.props.dinosaurs}</div>
      </div>
    );
  }
}

export default Relay.createContainer(Grid, {
  initialVariables: {
    period: 'jurassic'
  },
  fragments: {
    dinosaurs: () => Relay.QL`
      fragment on GeologicPeriod {
        dinosaurs(period: $period)
      }
    `
  }
});
