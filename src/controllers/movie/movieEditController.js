challengeApp.controller('MovieEditCtrl', function ($scope, $routeParams, $location, MovieService, ActorService) {
    $scope.genreOptions = MovieService.getGenreOptions();
    $scope.movie = {};

    var getMovieActors = function () {
        ActorService.getActorsByMovie($scope.movie.id).then(function (results) {
            $scope.movieActors = results;
            getFilteredActors();
        });
    };

    var getFilteredActors = function () {
        ActorService.getFilteredActors($scope.movieActors).then(function(results){
            $scope.actors = results;
        });
    };

    ActorService.getList().then(function (results) {
        $scope.actors = results;
    });


    MovieService.selectForUpdate($routeParams.id).then(function (movie) {
        $scope.movie = movie;
        getMovieActors();
    });

    $scope.getImage = function () {
        if ($scope.file) {
            $scope.movie.picture = $scope.file.base64;
        }
    };

    $scope.updateMovie = function (isValid) {
        if (isValid) {
            MovieService.update($scope.movie);

            $location.path('movies/');
        }
    };

    $scope.addActor = function () {
        if ($scope.selectedActor) {
            ActorService.addActorToMovie($scope.selectedActor, $scope.movie.id).then(function () {
                getMovieActors();
            });
        }
    };

    $scope.removeActorFromMovie = function (idActor) {
        ActorService.removeActorFromMovie(idActor, $scope.movie.id).then(function () {
            getMovieActors();
        });
    };
});