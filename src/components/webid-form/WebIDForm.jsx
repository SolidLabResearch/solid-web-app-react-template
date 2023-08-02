const { QueryEngine } = require("@comunica/query-sparql");
const {
  getDefaultSession,
  login,
  handleIncomingRedirect
} = require("@inrupt/solid-client-authn-browser");
const { useState, useEffect } = require("react");
import "./WebIDForm.css";

function WebIDForm() {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoggedIn, setLoggedIn] = useState(
    getDefaultSession().info.isLoggedIn
  );

  const session = getDefaultSession();
  useEffect(() => {
    session.onLogin(() => setLoggedIn(true));
    session.onLogout(() => setLoggedIn(false));

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

  /**
   * Logs in the user with the given WebID.
   * @param {Event} event event that triggered the function call
   */
  async function handleLogin(event) {
    event.preventDefault();
    const webId = event.target[0].value;
    try {
      await getOIDCIssuerAndLogIn(webId, setErrorMessage);
      setLoggedIn(true);
    } catch (error) {
      setLoggedIn(false);
    }
  }

  /**
   * Logs out the user and sets the loggedIn state to false.
   * @param {Event} event event that triggered the function call
   */
  function handleLogout(event) {
    event.preventDefault();
    getDefaultSession().logout();
    setLoggedIn(false);
  }

  return (
    <>
      {!isLoggedIn && (
        <form onSubmit={handleLogin} id="webid-form">
          <label htmlFor="webid">WebID</label>
          <input
            type="text"
            id="webid"
            name="webid"
            placeholder="Enter your WebID"
            value="http://localhost:3000/example/profile/card#me"
          />
          <input type="submit" id="log-in-btn" value="Login" />
        </form>
      )}
      {errorMessage && <div id="no-oidc-issuer-error">{errorMessage}</div>}
      {isLoggedIn && (
        <div id="user">
          <p>
            Logged in with WebID{" "}
            <span id="current-webid">{getDefaultSession().info.webId}</span>
          </p>
          <button onClick={handleLogout} id="log-out-btn">Log out</button>
        </div>
      )}
    </>
  );
}

/**
 * Gets the OIDC issuer from a given WebID and logs in the user with it.
 * @param {String} webId the WebID to get the OIDC issuer from
 * @param {Function} errorSetter function to set the errorMessage state
 */
async function getOIDCIssuerAndLogIn(webId, errorSetter) {
  const myEngine = new QueryEngine();
  const bindingsStream = await myEngine.queryBindings(
    `
      PREFIX solid: <http://www.w3.org/ns/solid/terms#> 
      SELECT ?oidcIssuer WHERE {
        <${webId}> solid:oidcIssuer ?oidcIssuer
      }`,
    {
      sources: [webId],
    }
  );

  const bindings = await bindingsStream.toArray();
  if (bindings.length > 0) {
    if (bindings.length > 1) {
      console.warn(
        `More than 1 OIDC issuer is present in the WebID. Using the first one returned by Comunica.`
      );
    }

    console.log("Using OIDC issuer: " + bindings[0].get("oidcIssuer").id);
    try {
      await solidLogin(bindings[0].get("oidcIssuer").id);
    } catch (error) {
      setErrorMessage("Failed to log in. Please try again.");
    }
  } else {
    errorSetter("Error: the WebID has no OIDC issuer defined.");
  }
}

/**
 * This method logs in the user via a given OIDC issuer.
 * The user is redirected to the login page of the identity provider
 * and all state of the app is gone.
 * @param oidcIssuer - The OIDC issuer to log in with.
 * @returns {Promise<void>}
 */
async function solidLogin(oidcIssuer) {
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer,
      redirectUrl: window.location.href,
      clientName: "Solid React App",
    });
  }
}

export default WebIDForm;
