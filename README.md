# Getting started

## Prerequisites

- Docker
- Docker compose
- Node v16: https://nodejs.org/en/download/

## Configuration

### Create .env file

Create a `.env` file in the root of the project, it's git ignored. See `.env.example` for required env variables.

### Docker configuration

Once you have `docker` and `docker-compose` installed `cd` into this project via terminal and run:

```bash
docker-compose up -d
```

This will spin up 2 services, namely the mongo database and the mongo-express service which is a GUI for our mongodb. To access mongo-express navigate to `http://localhost:8081`

### Installing dependencies:

```bash
npm install
```

### Running the server:

```bash
npm run start
```

### Lint:

```bash
npm run lint
# or
npm run lint:fix
```

# Controller registration API

Controllers reside in the controllers directory. Each controller exports an array of objects. These objects must contain the following properties:

- httpMethod: the http method for the controller action
- path: the path to the controllers action
- action: the action itself
- authed: whether the controller's action is authenticated (default: false)

The name of the controller file is important as it's the base of every object's path defined in it.

Example:

`controllers/home.js`

```javascript
const about = {
  httpMethod: 'get',
  path: '/about',
  action: (req, res) => {
    res.status(200).render('about')
  },
  authed: true,
}

module.exports = [about]
```

To access this about page you would have to navigate to `/home/about` and to also be logged in (authenticated) as the name of the file is `home.js` and as stated above the name is used as a base path.

The `index.js` file has the root base path.

# Documentation:

- Node.js : https://nodejs.org/en/docs/
- Express: https://expressjs.com/
- Socket.io: https://socket.io/docs/v4/
- PeerJS: https://peerjs.com/docs/
- Peer server: https://github.com/peers/peerjs-server#readme
- MongoDB: https://www.mongodb.com/docs/
- Mongoose: https://mongoosejs.com/docs/
- Nunjucks templating engine: https://mozilla.github.io/nunjucks/templating.html

# TODOs:

- Dashboard page:
  - [x] View meetings
  - [x] Create meetings
  - [x] Join a meeting
  - [ ] Update meetings
  - [ ] Delete meetings
- Classroom:
  - [x] Send invite link
  - [x] Working chat
  - [ ] Proper user disconnect
  - [ ] Mute/Disable camera
  - [ ] Mute/Disable cameras all (professors only)
  - [ ] Share screen
- General features:
  - [x] Authentication
  - [x] Login page
  - [x] Database integration
  - [x] Join meetings with proper link
  - [ ] Authorization
