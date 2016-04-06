
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayRouter } from 'react-router-relay';
import { IndexRoute, Route, browserHistory } from 'react-router';

import JurrasicApp from './components/App';
import Grid from './components/Grid';
import GeologicQueries from './queries/GeologicQueries';

ReactDOM.render(
  <RelayRouter history={browserHistory}>
    <Route path="*" component={JurrasicApp} queries={GeologicQueries}>
      <IndexRoute
        component={Grid}
        queries={GeologicQueries}
      />
    </Route>
  </RelayRouter>,
  document.getElementById('jurassicRoot')
);
