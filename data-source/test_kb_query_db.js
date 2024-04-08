const dotenv = require('dotenv')

dotenv.config({ path: '../.env.local' })
fetch(
  'http://bj-3090.private.gluon-meson.tech:11000/components/knowledge-base/data-sets/211/search',
  {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.OFFLINE_TOKEN}`,
    },
    body: JSON.stringify({
      query: 'the highest price?',
    }),
    method: 'POST',
  },
)
  .then((res) => {
    return res.json()
  })
  .then((res) => {
    console.log(res)
    console.log(res.detail)
  })
  .catch((e) => {
    console.log(e)
  })
