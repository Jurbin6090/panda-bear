import express from 'express'
import bodyParser from 'body-parser'
import infix from 'bind-infix'
import Promise from 'bluebird'
import BambooHr from 'node-bamboohr'

import BambooMeta from './service/meta-data'

let app = express()

app.use(bodyParser.json({'type': '*/*'}));

let config = {apikey: '4c158bb7d0aa9245918fa8e9270504a41c997515', subdomain: 'cooksys'}

let bamboo = new BambooHr(config)

let meta = new BambooMeta(config)

Promise.promisifyAll(Object.getPrototypeOf(bamboo))
Promise.promisifyAll(Object.getPrototypeOf(bamboo.employee(0)))


let error = infix((res, err) => {

  res.status(500)
  res.send(err)
  res.end()

})

let sendAll = infix((req, data) => {

  req.send(data)
  req.end()

})

let respond = call => (req, res) => call(req).then(res::sendAll).catch(res::error)

let fieldNames = []

let resetCache = () => meta.getFields()
  .then(data => data.map(field => field.name).filter(data => data))
  .then(data => fieldNames = data)


setInterval(resetCache, 1000 * 60 * 60 * 24)
resetCache().then(() => {

  app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  })

  app.get('/employee', respond(req => bamboo.employeesAsync().then(employees => employees.map(emp => ({"id": emp.id, ...emp.fields})))))

  app.get('/employee/:id', respond(req => bamboo.employee(req.params.id).getAsync(...fieldNames).then(employee => employee.fields)))


  app.post('/search', respond(req => {

    let query = req.body

    let compares = Object.keys(query)
    .map(key => ({

      key,
      value: query[key].toLowerCase()

    }))

    return bamboo.employeesAsync()
      .then(employees =>

        employees.map(emp => ({"id": emp.id, ...emp.fields}))
        .filter(emp =>
          compares
          .map(check => emp[check.key].toLowerCase().indexOf(check.value) > -1)
          .reduce((l, r) => l && r, true)
        )
      )

  }))


  app.listen(8080)
}).catch((err) => {
  throw new Error(`Failed to retrieve meta data from Bamboo: ${err}`)
})
