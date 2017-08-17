const gulp = require('gulp');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const fs = require('fs-extra');
const svg2png = require('gulp-svg2png');
const rename = require('gulp-rename');
const zip = require('gulp-zip');

const webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false
    })
  ]
};

gulp.task('lint:gulp', () => gulp.src(['./gulpfile.js']).pipe(eslint({ fix: true })).pipe(gulp.dest('./')));

gulp.task('lint:js', () =>
  gulp
    .src([`${__dirname}/src/**/*.jsx`, `${__dirname}/src/**/*.js`])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulp.dest('src'))
);

gulp.task('lint', ['lint:gulp', 'lint:js']);

gulp.task('clean', callback => fs.emptyDir(`${__dirname}/dist`, callback));

gulp.task('popup', ['clean'], callback => {
  const cfg = Object.create(webpackConfig);
  cfg.entry = `${__dirname}/src/popup/index.jsx`;
  cfg.output = {
    filename: 'index.min.js',
    path: `${__dirname}/dist/popup/`,
    sourceMapFilename: 'index.map'
  };
  webpack(cfg, (err, stats) => {
    if (err) {
      console.error(err);
      throw new Error('webpack', err);
    }
    console.log(stats.toString({}));
    callback();
  });
});

gulp.task('background', ['clean'], callback => {
  const cfg = Object.create(webpackConfig);
  cfg.entry = `${__dirname}/src/background/index.js`;
  cfg.output = {
    filename: 'background.min.js',
    path: `${__dirname}/dist/`
  };
  webpack(cfg, (err, stats) => {
    if (err) {
      console.error(err);
      throw new Error('webpack', err);
    }
    console.log(stats.toString({}));
    callback();
  });
});

gulp.task('content', ['clean'], callback => {
  const cfg = Object.create(webpackConfig);
  cfg.entry = `${__dirname}/src/content/index.js`;
  cfg.output = {
    filename: 'content.min.js',
    path: `${__dirname}/dist/`
  };
  webpack(cfg, (err, stats) => {
    if (err) {
      console.error(err);
      throw new Error('webpack', err);
    }
    console.log(stats.toString({}));
    callback();
  });
});

gulp.task('copy-static', ['clean'], callback => {
  fs.copySync(`${__dirname}/src/popup/index.html`, `${__dirname}/dist/popup/index.html`);
  fs.copySync(`${__dirname}/src/popup/index.css`, `${__dirname}/dist/popup/index.css`);

  fs.copySync(`${__dirname}/_locales`, `${__dirname}/dist/_locales`);
  fs.copySync(`${__dirname}/manifest.json`, `${__dirname}/dist/manifest.json`);

  callback();
});

gulp.task('icons', ['clean'], () => {
  [16, 32, 48].forEach(s => {
    gulp
      .src(`${__dirname}/icons/icon.svg`)
      .pipe(svg2png({ width: s, height: s }))
      .pipe(rename(`icon-${s}.png`))
      .pipe(gulp.dest(`${__dirname}/dist/icons/`));
  });
});

gulp.task('zip', ['build'], () =>
  gulp.src('dist/**/*').pipe(zip('niobium-password-gen.zip')).pipe(gulp.dest(__dirname))
);

gulp.task('webpack', ['popup', 'content', 'background']);

gulp.task('build', ['clean', 'icons', 'copy-static', 'webpack']);

gulp.task('default', ['start']);
