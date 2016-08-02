var path = require('path');

module.exports = function(grunt) {
  'use strict';

  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // ##### Project metadata
    pkg:      grunt.file.readJSON('package.json'),
    settings: grunt.file.readYAML('.settings.yml'),

    // ##### Before generating any new files, remove files from previous build.
    clean: {
      build:    [
        "js/app.pkgd.js",
        "css/*",
        "_dist/_styleguide/*"
      ]
    },

    // ##### Build "HTML" from "*.twig"-templates + data
    twigRender: {
      styleguide: {
        files: [
          {
            data:   ['<%= settings.data %>/data.json'],
            expand: true,
            cwd:    '',
            src:    ['<%= settings.patterns %>/**/*.twig'],
            dest:   '<%= settings.styleguide %>/_patterns/',
            ext:    '.html'   // index.twig + datafile.json => index.html
          }
        ]
      }
    },

    // ##### Generate "SASS" import file with all atoms, molecules, organisms and templates
    sassimp: {
      site: {
        files: [
          '<%= settings.atoms %>/**/*.scss',
          '<%= settings.molecules %>/**/*.scss',
          '<%= settings.organisms %>/**/*.scss',
          '<%= settings.templates %>/**/*.scss'
        ],
        dest:  'scss/_components.scss'
      }
    },

    // ##### Generate "CSS" from *.scss
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files:   [
          {
            expand: true,
            cwd:    'scss/',
            src:    ['**/*.scss'],
            dest:   'css/',
            ext:    '.css'
          }
        ]
      }
    },

    // ##### Generate prefixed "CSS"
    autoprefixer: {
      options:        {
        browsers: ['> 1%', 'last 3 version', 'ie 9'],
        map:      true
      },
      multiple_files: {
        expand:  true,
        flatten: true,
        src:     'css/*.css',
        dest:    'css/'
      }
    },

    // ##### Generate minified "CSS"
    cssmin: {
      target: {
        files: {
          'css/app.min.css': ['css/app.css']
        }
      }
    },

    // ##### Generate one big "JS"-package
    concat: {
      js: {
        options: {
          separator: '\n\r',
          sourceMap: true
        },
        src:     [
          'js/app.js',
          ['<%= settings.patterns %>/**/*.js']
        ],
        dest:    'js/app.pkgd.js'
      }
    },

    // ##### Generate minified "JS"
    uglify: {
      js: {
        options: {
          sourceMap: true
        },
        files:   [
          {
            expand: false,
            src:    'js/app.pkgd.js',
            dest:   'js/app.pkgd.js'
          }
        ]
      }
    },

    // ##### Copy files
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src:    ['css/**/*'],
            dest:   '_dist/assets/',
            filter: 'isFile'
          },
          {
            expand: true,
            src:    ['js/**/*'],
            dest:   '_dist/assets/',
            filter: 'isFile'
          },
          {
            expand: true,
            src:    ['images/**/*'],
            dest:   '_dist/assets/',
            filter: 'isFile'
          },
          {
            expand:  true,
            flatten: true,
            src:     [
              '<%= settings.patterns %>/**/*.gif',
              '<%= settings.patterns %>/**/*.jpg',
              '<%= settings.patterns %>/**/*.svg',
              '<%= settings.patterns %>/**/*.png',
              '<%= settings.patterns %>/**/*.jpeg'
            ],
            dest:    '_dist/assets/images',
            filter:  'isFile'
          },
          // copy styleguide files
          {
            expand:  true,
            src:     ['styleguide_src/**/*'],
            dest:    '_dist/_styleguide/'
          }
        ]
      }
    },

    // ##### Watch files
    watch: {
      twig: {
        files:   ['*.twig'],
        options: {
          livereload: true
        },
        tasks:   ['styleguide']
      },
      js: {
        files:   [
          'js/*.js',
          '<%= settings.patterns %>/**/*.js'
        ],
        tasks:   [
          'scripts',
          'copy-vendor'
        ],
        options: {
          livereload: true
        }
      },
      sass: {
        files:   [
          'scss/**/*.scss',
          '<%= settings.patterns %>/**/*.scss'
        ],
        tasks:   [
          'styles',
          'copy-vendor'
        ],
        options: {
          livereload: true,
          spawn:      false       // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
        }
      }
    }

  });

  // load all plugins from the "package.json"-file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // ### Custom task to generate import statements of all components
  //
  grunt.registerTask('sassimp', function(target) {
    // Get the options
    var options  = grunt.config.get(this.name)[target];
    var filesTmp = options.files;
    var files    = ['// Autogenerated - Don\'t modify! '];

    // Get all files matching the glob from options
    grunt.file.expand(filesTmp).map(function(filepath) {

      // DEUBG
      console.log('console.log: ' + filepath);

      // Get basename
      var ofile = path.basename(filepath);
      var file  = ofile.replace(".scss", "").substr(1);

      // Push SASS import statement into array
      files.push('@import "' + "../" + filepath.replace(ofile, file) + '";');
    });

    // Write results to destination file
    grunt.file.write(options.dest, files.join("\n"));
  });

  // * `grunt`
  // > Default task
  grunt.registerTask('default', [
    'styleguide',
    'watch'
  ]);

  // * `grunt styleguide`
  // > Build the style-guide
  grunt.registerTask('styleguide', [
    'newer:twigRender:styleguide'
  ]);

  // * `grunt styles`
  // > Generate components import and compile SASS
  grunt.registerTask('styles', [
    'sassimp:site',
    'sass:dist',
    'newer:autoprefixer',
    'newer:cssmin'
  ]);

  // * `grunt copy-vendor`
  // > Generate javascript
  grunt.registerTask('copy-vendor', [
    'newer:copy:main'
  ]);

  // * `grunt scripts`
  // > Generate javascript
  grunt.registerTask('scripts', [
    'newer:concat:js',
    'newer:uglify:js'
  ]);

  // * `grunt clean-build`
  // > Delete all generated code
  grunt.registerTask('clean-build', ['clean:build']);

  // * `grunt build`
  // > Build the website with JS, CSS, style-guide, ...
  grunt.registerTask(
      'build',
      'Build this website ... yeaahhh!',
      [
        'clean:build',
        'scripts',
        'styles',
        'styleguide',
        'copy-vendor'
      ]
  );
};
