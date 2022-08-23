const home = {
  httpMethod: 'get',
  path: '/',
  action: (req, res) => {
    res.status(200).render('home')
  },
}

module.exports = [home]
