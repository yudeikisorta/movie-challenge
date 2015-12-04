challengeApp.controller('ActorEditCtrl', function ($scope, $routeParams, $location, $filter, ActorService) {
    ActorService.select($routeParams.id).then(function (actor) {
        $scope.actor = actor;
    });

    $scope.updateActor = function (isValid) {
        if (isValid) {
            ActorService.update($scope.actor);

            $location.path('actors/');
        }
    };
});