const fs = require('fs');
const async = require('async');
const chapters = require('./chapters.json');
const MAX_PARALLEL = 10;

async.forEachSeries(Object.keys(chapters), (book, doneBook) => {
  const numChapters = chapters[book];
  async.forEachLimit(Array(numChapters).fill(0).map((_, i) => i+1), MAX_PARALLEL, (chapter, callback) => {
    console.log('Fetching ' + book + ' ' + chapter);
    fetch('https://bible-api.com/' + book + ' ' + chapter + '?translation=webbe').then(res => res.json()).then(json => {
      console.log('Fetched ' + book + ' ' + chapter);
      fs.writeFile('data/' + book + chapter + '.json', JSON.stringify(json), callback);
    }).catch(() => {
      console.log('Failed to fetch ' + book + ' ' + chapter);
      callback();
    });
  }).then(() => {
    doneBook();
  });
}).then(() => {
  console.log('Finished');
});