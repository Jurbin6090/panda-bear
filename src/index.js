import express from 'express'
import bodyParser from 'body-parser'


import Bamboohr from 'node-bamboohr'

import listEmployees from './model/get-employees'
import getEmployee from './model/get-employee'

import getMetaData from './service/meta-data'


let app = express()

app.use(bodyParser.json({'type': '*/*'}));


let bamboo = new Bamboohr({apikey: '4c158bb7d0aa9245918fa8e9270504a41c997515', subdomain: 'cooksys'})


let respond = (promise, res) => promise.then(data => res.send(data)).then(() => res.end())

let fieldList

getMetaData()
    .then(data => data.map(field => field.name).filter(data => data).reduce((l, r) => l ? `${l},${r}` : r))
    .then(data => fieldList = data)

app.get('/employee', (req, res) => respond(listEmployees(), res))
app.get('/employee/:id', (req, res) => respond( getEmployee(req.params.id, fieldList) , res))

app.get('/name/:id', (req, res) => {

  bamboo.employee(req.params.id).get('firstName', 'lastName' , (err, employee) => {

      if(err) {
        res.status(500)
        res.send(err)
      } else {
        res.send(employee.fields)
      }

    res.end()

  })


})


app.post('/search', (req, res) => {

  let query = req.body

  console.dir(query)

  bamboo.employees((err, employees) => {

    if(err) {
      res.status(500)
      res.send(err)
    } else {

      let results = employees.map(emp => ({ "id": emp.id, ...emp.fields }))
                .filter(emp => {
                  return Object.keys(query)
                      .map(key => emp[key] === query[key])
                      .reduce((l, r) => l && r, true)
                })

      res.send(results)
    }

    res.end()

  })


})




app.get('/meta', (req, res) => respond(getMetaData(), res))


app.listen(5000)




