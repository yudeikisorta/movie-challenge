challengeApp.controller('MovieEditActorsCtrl', function ($scope, $routeParams, MovieService, ActorService, DatabaseService) {
    MovieService.select($routeParams.id).then(function (movie) {
        $scope.movie = movie;
    });

    var getMovieActors = function () {
        ActorService.getActorsByMovie($routeParams.id).then(function (results) {
            $scope.movieActors = results;
            getFilteredActors();
        });
    };

    var getFilteredActors = function () {
        ActorService.getFilteredActors($scope.movieActors).then(function(results){
            $scope.actors = results;
        });
    };

    getMovieActors();

    $scope.createActor = function () {
        ActorService.create($scope.actor, $routeParams.id).then(function () {
            getMovieActors();
            $scope.actor = null;
            $scope.actorForm.$setPristine(true);
            $scope.actorForm.$setUntouched(true);
        });
    };

    $scope.addActor = function () {
        if ($scope.selectedActor) {
            ActorService.addActorToMovie($scope.selectedActor, $routeParams.id).then(function () {
                getMovieActors();
            });
        }
    };

    $scope.removeActorFromMovie = function (idActor) {
        ActorService.removeActorFromMovie(idActor, $routeParams.id).then(function () {
            getMovieActors();
        });
    };
});