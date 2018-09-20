const test = require('ava');
const sinon = require('sinon');
const utils = require('@unic/estatico-utils').test;
const merge = require('lodash.merge');
const task = require('../index.js');

const defaults = {
  srcBase: './test/fixtures',
};

test.cb('default', (t) => {
  const spy = sinon.spy(console, 'log');
  const options = merge({}, defaults, {
    src: ['./test/fixtures/default/*.js'],
    plugins: {
      setup: {
        getData: content => content,
        getSchema: () => require('./fixtures/default/schema.json'), // eslint-disable-line global-require
      },
    },
  });

  task(options, {
    dev: true,
  })().on('finish', () => {
    spy.restore();

    const log = utils.stripLogs(spy);

    // error.js should log two errors
    t.regex(log, /default\/error\.js #\/required: should have required property 'firstName'/);
    t.regex(log, /default\/error\.js #\/properties\/age\/type: should be integer/);

    // success.js should not log any errors
    t.notRegex(log, /default\/success\.js/);

    t.end();
  });
});

test.cb('variants', (t) => {
  const spy = sinon.spy(console, 'log');
  const options = merge({}, defaults, {
    src: ['./test/fixtures/variants/*.js'],
    plugins: {
      setup: {
        getSchema: () => require('./fixtures/variants/schema.json'), // eslint-disable-line global-require
      },
    },
  });

  task(options, {
    dev: true,
  })().on('finish', () => {
    spy.restore();

    const log = utils.stripLogs(spy);

    // error.js should log two errors
    t.regex(log, /variants\/error\.js \[Default\] #\/required: should have required property 'firstName'/);
    t.regex(log, /variants\/error\.js \[Variant 1\] #\/properties\/age\/type: should be integer/);

    // success.js should not log any errors
    t.notRegex(log, /variants\/success\.js/);

    t.end();
  });
});
