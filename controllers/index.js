const home = {
  httpMethod: 'get',
  path: '/',
  function: (req, res) => {
    res.status(200).render('home')
  },
}

module.exports = [home]
