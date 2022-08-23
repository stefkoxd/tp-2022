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

Example:

```javascript
const home = {
  httpMethod: 'get',
  path: '/',
  function: (req, res) => {
    res.status(200).render('home')
  },
}

module.exports = [home]
```

# TODOs:

- Home page:
  - Create session (for teachers) []
  - View active sessions (for studends, only for courses they listen) []
- Classroom:
  - Proper user disconnect []
  - Mute/Disable camera []
  - Mute/Disable cameras all (teachers only) []
  - Send invite link []
  - Share screen []
  - Working chat [X]
- General features:
  - Authorization and authentication (teacher-student roles) []
  - Login page []
  - Database integration []
