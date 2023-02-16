import React, { useState, useLayoutEffect } from 'react';
import {Routes, Route, Router, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { routes } from "@/app/routes";
import theme from "@/theme";
import history from "@/shared/utils/history";

const CustomRouter = ({ basename, children, history }) => {
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
  //   <CustomRouter history={history}>
  //     <Routes>
  //       {routes.map((item) => <Route key={item.path} path={item.path} exact element={item.element} />)}
  //     </Routes>
  // </CustomRouter> 
    <ThemeProvider theme={theme}>
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}

export default App;
