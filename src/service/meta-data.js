import https from 'https'
import Promise from 'bluebird'
import {parseString} from 'xml2js'


export default class BambooMeta {

  constructor({apikey, subdomain}) {


    this.getFields = () => {

      return new Promise((resolve, reject) =>

        https.get(`https://${apikey}:x@api.bamboohr.com/api/gateway.php/${subdomain}/v1/meta/fields/`, res => {

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
  }
}
