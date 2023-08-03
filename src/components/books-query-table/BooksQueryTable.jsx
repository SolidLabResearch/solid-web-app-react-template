import { fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { QueryEngine } from "@comunica/query-sparql";
import { useState } from "react";

function BooksQueryTable() {
  const [results, setResults] = useState([]);
  const isLoggedIn = getDefaultSession().info.isLoggedIn;

  return (
    <>
      <button
        onClick={() =>
          queryBooks("http://localhost:3000/example/wish-list", setResults)
        }
      >
        Show book wish list (public)
      </button>
      {isLoggedIn && (
        <button onClick={() => {
          queryBooks("http://localhost:3000/example/favourite-books", setResults)
        }}>
          Show favourite books (private)
        </button>
      )}

      {results.length > 0 && (
        <>
          <h4>{results[0].get("listTitle").value}</h4>
          <ul>
            {results.map((result, index) => {
              return (
                <li key={index}>
                  {result.get("bookTitle").value} (
                  {result.get("authorName").value})
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

/**
 * This function queries a list of books at the given url.
 * The results are shown in the HTML as an unordered list.
 * @param {String} url - The url of a resource with books.
 * @param {Function }resultAdder - A function that adds the results to the results state.
 * @returns {Promise<void>}
 */
async function queryBooks(url, resultAdder) {
  resultAdder([]);

  const myEngine = new QueryEngine();
  const bindingsStream = await myEngine.queryBindings(
    `
    PREFIX schema: <http://schema.org/> 
    SELECT * WHERE {
     ?list schema:name ?listTitle;
       schema:itemListElement [
       schema:name ?bookTitle;
       schema:creator [
         schema:name ?authorName
       ]
     ].
    }`,
    {
      sources: [url],
      fetch,
    }
  );
  // The above fetch is an authenticated fetch once the user is logged in.

  bindingsStream.on("data", (binding) => {
    resultAdder((old) => [...old, binding]);
  });
}


export default BooksQueryTable;