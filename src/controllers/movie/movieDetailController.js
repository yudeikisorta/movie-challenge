challengeApp.controller('MovieDetailCtrl', function ($scope, $routeParams, $filter, MovieService, ActorService) {
    $scope.load = true;


    MovieService.select($routeParams.id, true).then(function (movie) {
        $scope.movie = movie;

        MovieService.getRelatedMovies(movie, 0);
        MovieService.relatedMoviesByActor(movie).then(function(result){
            $scope.movie.relatedMoviesActor = result;
        });

    });

    MovieService.getMovieLastRate($routeParams.id).then(function (item) {
        $scope.last_rate = item;
    });

    ActorService.getActorsByMovie($routeParams.id).then(function (results) {
        $scope.actors = results;
        $scope.load = false;
    });

    $scope.updateRating = function (rate) {
        MovieService.updateRating($scope.movie, rate).then(function (movie) {
            $scope.movie = movie;
        });
    };

    $scope.movieRelated = [];

});