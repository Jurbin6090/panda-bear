import { parseString } from 'xml2js'


let xml = "<root>Hello xml2js!</root>"


parseString(xml, (err, result) => {
  console.dir(result);
});





















