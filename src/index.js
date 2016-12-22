import https from 'https'
import {parseString} from 'xml2js'

https.get('https://[apikey]:x@api.bamboohr.com/api/gateway.php/cooksys/v1/employees/directory', res => {

  res.setEncoding('utf8');

  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);

  res.on('end', () => {
    try {
      parseString(rawData, (err, result) => {

        let employees = result.directory.employees

        let emps = employees[0].employee.map(employee => {


          return {

            id: employee.$.id,

            fields: employee.field.map(field => {

              return {

                id: field.$.id,
                value: field._

              }

            })
          }

        })

        emps.forEach(console.dir)


      });
    } catch (e) {
      console.log(e.message);
    }
  });


})






















