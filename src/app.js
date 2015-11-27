var challengeApp = angular.module( 'challengeApp', [
        'ngRoute',
        'ngBootbox',
        'ui.select2',
        '720kb.datepicker',
        'angular-websql',
        'angular-input-stars',
        'angularUtils.directives.dirPagination'
    ])

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input && input !== null){
                input = input.toLowerCase();
                return input.substring(0,1).toUpperCase()+input.substring(1);
            }
            return input;
        };
    })

    .controller( 'HomeCtrl', function($scope, MovieService, DatabaseService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        DatabaseService.executeQuery('SELECT * FROM movies ORDER BY id DESC LIMIT 0,10').then(function(results){
            var items = [];
            for(var i=0; i < results.rows.length; i++){
                items.push(results.rows.item(i));
            }
            $scope.movies = items;
        });


       /* DatabaseService.executeQuery('SELECT movies.*, count(id_movie) FROM movie_rates ' +
                'INNER JOIN movies on movie_rates.id_movie = movies.id ' +
                'GROUP BY id_movie ORDER BY count(id_movie) DESC LIMIT 0,2').then(function(results){
            var items = [];
            for(var i=0; i < results.rows.length; i++){
                items.push(results.rows.item(i));
            }
            $scope.movie_rates = items;
        });*/
    });