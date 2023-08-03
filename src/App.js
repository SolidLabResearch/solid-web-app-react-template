import React, { useEffect, useState } from "react";
import WebIDForm from "./components/webid-form/WebIDForm.jsx";
import "./App.css";
import BooksQueryTable from "./components/books-query-table/BooksQueryTable.jsx";
import { getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";

const App = () => {
  const session = getDefaultSession();
  const [isLoggedIn, setLoggedIn] = useState(session.info.isLoggedIn);

  useEffect(() => {
    session.onLogin(() => setLoggedIn(true));
    session.onLogout(() => {setLoggedIn(false); console.log("logout")});

    // In this function we don't use await because inside a React Effect it causes linting warnings and according to several sources on the Web it is not recommended.
    // https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
    // https://www.thisdot.co/blog/async-code-in-useeffect-is-dangerous-how-do-we-deal-with-it/
    handleIncomingRedirect({ restorePreviousSession: true }).then((info) => {
      if (info) {
        let status = info.isLoggedIn;
        if (status !== isLoggedIn) {
          setLoggedIn(status);
        }
      }
    });
  });
  return (
    <>
      <h1>HELLOOO</h1>
      <WebIDForm isLoggedIn={isLoggedIn} />
      <BooksQueryTable isLoggedIn={isLoggedIn} />
    </>
  );
};

export default App;
