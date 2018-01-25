const gulp = require('gulp');
const path = require('path');
const estaticoHandlebars = require('estatico-handlebars');
const estaticoHtmlValidate = require('estatico-w3c-validator');
const estaticoStylelint = require('estatico-stylelint');
// const estaticoWatch = require('estatico-watch');

// Exemplary custom config
const config = {
  handlebars: {
    src: [
      './src/*.hbs',
      './src/pages/**/*.hbs',
      './src/demo/pages/**/*.hbs',
      './src/modules/**/!(_)*.hbs',
      './src/demo/modules/**/!(_)*.hbs',
      './src/preview/styleguide/*.hbs',
    ],
    srcBase: './src',
    dest: './dist',
    plugins: {
      handlebars: {
        partials: [
          './src/layouts/*.hbs',
          './src/modules/**/*.hbs',
          './src/demo/modules/**/*.hbs',
          './src/preview/**/*.hbs',
        ],
      },
      // Use JSON file instead of data.js
      data: file => require(file.path.replace(path.extname(file.path), '.json')), // eslint-disable-line global-require, import/no-dynamic-require
    },
  },
  htmlValidate: {
    src: [
      './dist/*.html',
      // './dist/modules/**/*.html',
      // './dist/pages/**/*.html',
    ],
    srcBase: './dist/',
  },
  stylelint: {
    src: [
      './src/**/*.scss',
    ],
    srcBase: './src/',
  },
  watch: null,
};

// Exemplary tasks
const tasks = {
  // Create named functions so gulp-cli can properly log them
  handlebars: function handlebars() {
    return estaticoHandlebars(config.handlebars);
  },
  htmlValidate: function htmlValidate() {
    return estaticoHtmlValidate(config.htmlValidate);
  },
  stylelint: function stylelint() {
    return estaticoStylelint(config.stylelint);
  },
};

gulp.task('default', gulp.series(tasks.handlebars, gulp.parallel(tasks.htmlValidate, tasks.stylelint)));

// gulp.task('watch', () => {
//   Object.keys(tasks).forEach((task) => {
//     const watchTask = estaticoWatch({
//       src: tasks[task].config.watch,
//       fn: tasks[task].fn,
//     }, gulp);

//     try {
//       watchTask.fn();
//     } catch (err) {
//       // TODO: "Beautify" error handling
//       console.log(err);
//     }
//   });
// });