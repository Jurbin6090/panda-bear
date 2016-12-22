import https from 'https'
import Promise from 'bluebird'
import {parseString} from 'xml2js'


export default function getFields () {

  return new Promise((resolve, reject) =>

    https.get('https://4c158bb7d0aa9245918fa8e9270504a41c997515:x@api.bamboohr.com/api/gateway.php/cooksys/v1/meta/fields/', res => {

      res.setEncoding('utf8');

      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);

      res.on('end', () => {
        try {
          parseString(rawData, (err, result) => {

            if(err) {
              reject(err)
              return
            }

            let fields = result.fields.field

            let emps = fields.map(field => {

              return {
                "label": field._,
                "name": field.$.alias,
                "type": field.$.type,
                "id": field.$.id
              }
            })

            resolve(emps)

          });
        } catch (e) {
          reject(e)
        }
      });
    })
  )
}

