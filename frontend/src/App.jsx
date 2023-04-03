import React, { useState, useLayoutEffect, useEffect } from "react";
import { Routes, Route, Router } from "react-router-dom";
import { routes } from "@/app/routes";
import history from "@/shared/utils/history";
import { ThemeProvider } from "@/context/ThemeProvider";
import io from "socket.io-client";
import { useSocketStore } from "./stores/SocketStore";

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
  const { setClient, client } = useSocketStore((state) => state);

  useEffect(() => {
    const client = io("http://127.0.0.1:8000/");

    client.on("connect", () => {
      setClient(client);
    });

    client.on("disconnect", () => {
      setClient(null);
    });

    return () => {
      client.disconnect();
    };
  }, []);
  return (
    <ThemeProvider>
      <CustomRouter history={history}>
        <Routes>
          {routes.map((item) => {
            return (
              <Route key={item?.path} path={item?.path} element={item?.element}>
                {item?.children &&
                  item?.children.map((child) => (
                    <Route
                      key={child?.path}
                      path={child?.path}
                      element={child?.element}
                    >
                      {child?.children &&
                        child?.children.map((subChild) => (
                          <Route
                            key={subChild?.path}
                            path={subChild?.path}
                            element={subChild?.element}
                          />
                        ))}
                    </Route>
                  ))}
              </Route>
            );
          })}
        </Routes>
      </CustomRouter>
    </ThemeProvider>
  );
}

export default App;
