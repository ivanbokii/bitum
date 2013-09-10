module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      options: {
          timeout: 3000, 
          ui: 'bdd', 
          reporter: 'nyan'
      },

      all: { src: ['tests/**/*.js'] }
    },

    watch: {
      src: {
          files: ['daemon/*.js', 'tests/**/*.js'], 
          tasks: ['simplemocha']
      }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', 'simplemocha');
};