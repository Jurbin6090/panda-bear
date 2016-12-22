import https from 'https'
import Promise from 'bluebird'
import {parseString} from 'xml2js'


export default function getEmployee(id, fieldList) {

  return new Promise((resolve, reject) => {

      let url = `https://4c158bb7d0aa9245918fa8e9270504a41c997515:x@api.bamboohr.com/api/gateway.php/cooksys/v1/employees/${id}?fields=${fieldList}`

      https.get(url, res => {

          res.setEncoding('utf8');

          let rawData = '';
          res.on('data', (chunk) => rawData += chunk);

          res.on('end', () => {
            try {
              parseString(rawData, (err, result) => {

                if (err) {
                  reject(err)
                  return
                }

                let fields = result.employee.field.map(field => {
                  return {
                    [field.$.id]: field._
                  }
                }).reduce((l, r) => ({...l, ...r}), {id: result.employee.$.id})

                resolve(fields)

              })

            } catch (e) {
              reject(e)
            }
          });
        })
    }
  )
}

