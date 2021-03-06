# @unic/estatico-imageversions

Uses GraphicsMagick to create resized and optionally cropped image variants

## Installation

```
$ npm install --save-dev @unic/estatico-imageversions
```

## Usage

```js
const gulp = require('gulp');
const env = require('minimist')(process.argv.slice(2));

/**
 * Generate image versions
 * Uses GraphicsMagick to create resized and optionally cropped image variants
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('media:imageversions', () => {
  const task = require('@unic/estatico-imageversions');

  const instance = task({
    src: [
      './src/**/imageversions.config.js',
    ],
    srcBase: './src',
    dest: './dist/',
  }, env);
  
  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});
```

Run task (assuming the project's `package.json` specifies `"scripts": { "gulp": "gulp" }`):
`$ npm run gulp media:imageversions`

See possible flags specified above.

## API

`plugin(options, env)` => `taskFn`

### options

#### src (required)

Type: `Object`<br>
Default: `null`

Each property is passed to `gulp.src`, the key is used for the generated sprite's name.

#### srcBase (required)

Type: `String`<br>
Default: `null`

Passed as `base` option to `gulp.src`.

#### dest (required)

Type: `String`<br>
Default: `null`

Passed to `gulp.dest`.

#### watch

Type: `Object`<br>
Default: `null`

Passed to file watcher when `--watch` is used.

#### plugins

Type: `Object`

##### plugins.rename

Type: `Function`<br>
Default:
```js
(filePath, resizeConfig) => {
  const path = require('path');
  const baseName = path.basename(filePath, path.extname(filePath));

  return filePath.replace(baseName, `${baseName}_${resizeConfig.postfix}`);
}
```

##### plugins.resize

Type: `Object`<br>
Default:
```js
{
  addSizeWatermark: true,
}
```

##### plugins.imagemin

Type: `Object`<br>
Default: `{}`

Passed to [`imagemin`](https://www.npmjs.com/package/imagemin) via [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin). Setting to `null` will disable this step.

#### logger

Type: `{ info: Function, debug: Function, error: Function }`<br>
Default: Instance of [`estatico-utils`](../estatico-utils)'s `Logger` utility.

Set of logger utility functions used within the task.

### env

Type: `Object`<br>
Default: `{}`

Result from parsing CLI arguments via `minimist`, e.g. `{ dev: true, watch: true }`. Some defaults are affected by this, see above.

## License

Apache 2.0.
