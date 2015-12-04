challengeApp.controller('ActorDetailCtrl', function ($scope, $routeParams, MovieService, ActorService) {
    ActorService.select($routeParams.id).then(function (actor) {
        $scope.actor = actor;
    });

    MovieService.getMoviesByActor($routeParams.id).then(function (results) {
        $scope.movies = results;
    });
});