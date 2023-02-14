import React, { useState, useLayoutEffect } from 'react';
import {Routes, Route, Router } from 'react-router-dom';
import { routes } from "@/app/routes";
import history from "@/shared/utils/history";

export const CustomRouter = ({ basename, children, history }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

function App() {

  return (
    <CustomRouter history={history}>
      <Routes>
        {routes.map((item) => <Route key={item.path} path={item.path} exact element={item.element} />)}
      </Routes>
  </CustomRouter> 
  )
}

export default App;
