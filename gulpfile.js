// Native libraries
const fs = require(`fs`)
const path = require(`path`)
const process = require(`process`)

// NPM libraries
const gulp = require(`gulp`)

// Gulp libraries
const tinypng = require(`gulp-tinypng-compress`)
const filter = require(`gulp-filter`)
const clean = require(`gulp-clean`)
const htmlmin = require(`gulp-htmlmin`)
const terser = require(`gulp-terser`)

// BUILD TASKS

gulp.task(`build:clean`, () =>
	// select all the images inside the assets folder and all the files at the first directory level
	gulp.src([`./dist/*.*`])
		// filter out all the files that are present with the same name inside the source asset folder
		.pipe(filter(file => !fs.existsSync(path.join(__dirname, `/src/${file.basename}`))))
		// delete the remaining files
		.pipe(clean())
)

gulp.task(`build:js`, () =>
	gulp.src(`./src/index.js`)
		.pipe(terser())
		.pipe(gulp.dest(`./dist/`))
)

gulp.task(`build:html`, () =>
	gulp.src(`./src/**/*.html`)
		.pipe(htmlmin({
			minifyCSS: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			removeComments: true,
			removeEmptyAttributes: true,
			useShortDoctype: true
		}))
		.pipe(gulp.dest(`./dist/`))
)

gulp.task(`build:move`, () =>
	gulp.src(`./src/**/*.json`)
		.pipe(gulp.dest(`./dist/`))
)

gulp.task(`build:images`, () =>
	gulp.src(`./src/**/*.+(png|jpg)`)
		.pipe(tinypng({
			key: process.env.TINYPNG_API_KEY || require(`./tinypng-api.json`).key,
			sigFile: `./tinypng-api.json`,
			log: true
		}))
		.pipe(gulp.dest(`./dist/`))
)

// MACRO TASKS

gulp.task(`build`, gulp.series(`build:clean`, gulp.parallel(`build:html`, `build:move`, `build:js`, `build:images`)))

gulp.task(`build:watch`, () =>
	gulp.watch(`./src/**/*`, gulp.series(`build`))
)
