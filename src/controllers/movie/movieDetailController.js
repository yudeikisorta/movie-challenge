challengeApp.controller('MovieDetailCtrl', function ($scope, $routeParams, $filter, MovieService, ActorService) {
    MovieService.select($routeParams.id).then(function (movie) {
        $scope.movie = movie;
    });

    MovieService.getMovieLastRate($routeParams.id).then(function (item) {
        $scope.last_rate = item;
    });

    ActorService.getActorsByMovie($routeParams.id).then(function (results) {
        $scope.actors = results;
    });

    $scope.updateRating = function (rate) {
        MovieService.updateRating($scope.movie, rate).then(function (movie) {
            $scope.movie = movie;
        });
    };
});