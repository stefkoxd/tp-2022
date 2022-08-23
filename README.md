# Getting started

Installing dependencies:

```bash
npm install
```

Running the server:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

# Controller registration API

Controllers reside in the controllers directory. Each controller exports an array of objects. These objects must contain the following properties:

- httpMethod: the http method for the controller action
- path: the path to the controllers action
- function: the action itself

The name of the controller file is important as it's the base of every object's path defined in it.

Example:

`controllers/home.js`

```javascript
const home = {
  httpMethod: 'get',
  path: '/about',
  function: (req, res) => {
    res.status(200).render('about')
  },
}

module.exports = [home]
```

To access this about page you would have to navigate to `/home/about` as the name of the file is `home.js` and as stated above the name is used as a base path.

The `index.js` file has the root base path.

# Documentation:

- Node.js : https://nodejs.org/en/docs/
- Express: https://expressjs.com/
- Socket.io: https://socket.io/docs/v4/
- PeerJS: https://peerjs.com/docs/
- Peer server: https://github.com/peers/peerjs-server#readme
- Nunjucks templating engine: https://mozilla.github.io/nunjucks/templating.html

# TODOs:

- Home page:
  - [ ] Create session (for teachers)
  - [ ] View active sessions (for studends, only for courses they listen)
- Classroom:
  - [ ] Proper user disconnect
  - [ ] Mute/Disable camera
  - [ ] Mute/Disable cameras all (teachers only)
  - [x] Send invite link
  - [ ] Share screen
  - [x] Working chat
- General features:
  - [ ] Authorization and authentication (teacher-student roles)
  - [ ] Login page
  - [ ] Database integration
