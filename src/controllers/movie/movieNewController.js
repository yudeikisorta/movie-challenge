challengeApp.controller('MovieNewCtrl', function ($scope, $location, MovieService) {
    $scope.genreOptions = MovieService.getGenreOptions();

    $scope.createMovie = function (isValid) {
        if (isValid) {
            MovieService.create($scope.movie);

            $location.path('movies/');
        }
    };
});