/*global module:false*/
module.exports = function(grunt) {

   var cf_profile= function (patterns)
   {
      var files= grunt.file.expand({ cwd: 'dist/' },patterns);

      files.forEach(function (file,idx) { files[idx]= '/'+file; });

      return {
        resourcePaths: files,
        access_key: process.env.AWS_ACCESS_KEY_ID,
        secret_key: process.env.AWS_SECRET_ACCESS_KEY,
        dist: "EA1HKSIM8FJLV"
      };
   };


  // Project configuration.
  grunt.initConfig({

    'html-builder': {
    },
    watch: {
      json: {
         files: ['Gruntfile.js','src/js/transform/*.js','src/json/*.json','data/**/*'],
         tasks: ['html-builder-json','html-builder']
      },
      pages: {
         files: ['src/js/page/*.js','src/html/html.html','src/html/block/*.html','src/html/layout/*.html'],
         tasks: ['html-builder']
      },
      client: {
         files: ['src/client/**/*'],
         tasks: ['client']
      },
      templates: {
         files: ['src/html/template/*.html'],
         tasks: ['html-builder','client']
      }
    },
    connect: {
       server: {
          options: {
              port: 8080,
              base: './dist'
          }
       }
    },
    clean: ['./dist'],
    copy: {
      client: {
         files: [ {expand: true, cwd: 'src/client/', src: ['**'], dest: 'dist/'},
                  {expand: true, cwd: 'src/html/template/', src: ['*'], dest: 'dist/js/template/'}]
      }
    },
    s3: {
     options: {
       key:             process.env.AWS_ACCESS_KEY_ID,
       secret:          process.env.AWS_SECRET_ACCESS_KEY,
       region:          "eu-west-1",
       maxOperations:   10,
       bucket:          "test-plurimedia"
     },
     all: {
       upload: [ { src: 'dist/**/*', dest: '/', rel: 'dist' } ]
     },
     html: {
       upload: [ { src: 'dist/**/*.html', dest: '/', rel: 'dist' } ]
     },
     js: {
       upload: [ { src: 'dist/**/*.js', dest: '/', rel: 'dist' } ]
     },
     css: {
       upload: [ { src: 'dist/**/*.css', dest: '/', rel: 'dist' } ]
     }
    },
    cloudfront_clear: {
     all: cf_profile(['**/*']),
     html: cf_profile(['**/*.html']),
     js: cf_profile(['**/*.js']),
     css: cf_profile(['**/*.css'])
    }
  });

  // Default tasks
  grunt.registerTask('default', ['html-builder-json','html-builder','client']);
  grunt.registerTask('client', 'copy:client');
  grunt.registerTask('listen', ['connect','watch']);
  grunt.registerTask('deploy', ['s3:all','cloudfront_clear:all']);
  
  // contrib
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  
  // github
  grunt.loadNpmTasks('grunt-html-builder');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-cloudfront-clear');

};