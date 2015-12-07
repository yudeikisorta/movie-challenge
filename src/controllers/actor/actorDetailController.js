challengeApp.controller('ActorDetailCtrl', function ($scope, $routeParams, MovieService, ActorService) {
    $scope.load = true;

    ActorService.select($routeParams.id).then(function (actor) {
        $scope.actor = actor;
    });

    MovieService.getMoviesByActor($routeParams.id).then(function (results) {
        $scope.movies = results;
        $scope.load = false;
    });
});