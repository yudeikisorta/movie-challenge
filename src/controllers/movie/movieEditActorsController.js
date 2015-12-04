challengeApp.controller('MovieEditActorsCtrl', function ($scope, $routeParams, MovieService, ActorService) {
    MovieService.select($routeParams.id).then(function (movie) {
        $scope.movie = movie;
    });

    var getFilteredActors = function () {
        ActorService.getActorsByMovie($routeParams.id).then(function (results) {
            $scope.filteredActors = results;
        });
    };

    var getActors = function () {
        ActorService.getList().then(function (results) {
            $scope.actors = results;
        });
    };

    getActors();
    getFilteredActors();

    $scope.createActor = function () {
        ActorService.create($scope.actor, $routeParams.id).then(function () {
            getFilteredActors();
            getActors();
            $scope.actor = null;
            $scope.actorForm.$setPristine(true);
            $scope.actorForm.$setUntouched(true);
        });
    };

    $scope.addActor = function () {
        if ($scope.selectedActor) {
            ActorService.addActorToMovie($scope.selectedActor, $routeParams.id).then(function () {
                getFilteredActors();
            });
        }
    };

    $scope.removeActorFromMovie = function (idActor) {
        ActorService.removeActorFromMovie(idActor, $routeParams.id).then(function () {
            getFilteredActors();
        });
    };
});