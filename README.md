# Solid Web app template

This template helps you to get started with creating a Solid Web app.

## Features

- [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer) (CSS) to test with pods locally.
- [Comunica](https://comunica.dev/) for querying pods and other data sources.
- [Solid Authentication library](https://github.com/inrupt/solid-client-authn-js) 
  for authenticating with an identity provider.
  You find the browser-specific documentation 
  [here](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-browser/).
- [webpack](https://webpack.js.org/) to bundle the JavaScript.

## Usage

1. Clone this repository via
   ```shell
   git clone https://github.com/SolidLabResearch/solid-web-app-template.git
   ```
2. Install the dependencies via 
   ```shell
   npm i
   ```
3. Prepare the pods via
   ```shell
   npm run prepare:pods
   ```
4. Start Solid server with the pods via
   ```shell
   npm run start:pods
   ```
   The server is ready when the following message appears in the terminal
   ```
   Listening to server at http://localhost:3000/
   ```
   Keep this process running.
5. In another terminal serve the app using webpack via
   ```shell
   npm start
   ```
   The app is ready when the following message appears in the terminal
   ```
   webpack 5.88.1 compiled successfully
   ```
6. Browse to <http://localhost:8080> to use the app.
7. Click the button "Show book wish list (public)" to view a public list of books on the pod
   at <http://localhost:3000/example/wish-list>.
8. Log in with the WebID <http://localhost:3000/example/profile/card#me>.
   The email and password of the account are defined in `seeded-pod-config.json`.
   This file is used also in step 3 to prepare the pods.
9. Click the button "Show book wish list (private)" to view a private list of books on the pod
   at <http://localhost:3000/example/favourite-books>.

If at some point you want to reset the pod data,
you do 
```shell
npm run reset:pods
```

## Pod data

You find the initial pod data in the folder `initial-pod-data`.
It has two resources:
- `favourite-books`: this list contains the favourite books of the user. 
   This list is private. only the user has read, write, and control access.
   This is specified in `favourite-books.acl`.
- `wish-list`: this list contains the wish list of book of the user.
   This list is public: everybody can read the list, but only the user can write and control it.
   This is specified in `wish-list.acl`.

You find the shape to which the above two resources adhere in `shapes/book-list.ttl`.

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
