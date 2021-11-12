import React from 'react';

const RouteContext = React.createContext({
  route: {
    add: false,
    edit: null,
    info: null,
    filter: null,
  },
  updateRoute: () => {},
});

export default RouteContext;
