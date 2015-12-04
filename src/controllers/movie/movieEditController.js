challengeApp.controller('MovieEditCtrl', function ($scope, $routeParams, $location, MovieService) {
    $scope.genreOptions = MovieService.getGenreOptions();

    MovieService.selectForUpdate($routeParams.id).then(function (movie) {
        $scope.movie = movie;
    });

    $scope.updateMovie = function (isValid) {
        if (isValid) {
            MovieService.update($scope.movie);

            $location.path('movies/');
        }
    };
});