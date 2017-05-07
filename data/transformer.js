const fs = require('fs');
const xml2js = require('xml2js');
const json2csv = require('json2csv');

const parser = new xml2js.Parser();
fs.readFile(__dirname + '/CurrentLostProperty.aspx.xml', (err, data) => {
  parser.parseString(data, (err, result) => {
    console.log('xml parsed');

    const { LostProperty } = result;
    const Categories = LostProperty.Category;

    const fields = ['title', 'category', 'count'];
    const transformed = [];

    for (const c of Categories) {
      for (const s of c.SubCategory) {
        transformed.push({
          title: s['$'].SubCategory.trim(),
          category: c['$'].Category.trim(),
          count: parseInt(s['$'].count),
        });
      }
    }

    const csv = json2csv({ data: transformed, fields });

    fs.writeFile('export.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  });
});
