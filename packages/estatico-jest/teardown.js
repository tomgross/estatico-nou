const util = require('util');
const fs = require('fs');
const findProcess = require('find-process');
const terminate = require('terminate');

const asyncTerminate = util.promisify(terminate);

module.exports = async () => {
  // Close puppeteer browser instance
  await global.__BROWSER_GLOBAL__.close();

  // Delete file used to expose config data
  fs.unlinkSync('./.tmp-test-config.json');

  // Find and stop static server
  const [process] = await findProcess('port', global.__STATIC_PORT_GLOBAL__);
  await asyncTerminate(process.pid);
};
