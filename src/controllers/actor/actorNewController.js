challengeApp.controller('ActorNewCtrl', function ($scope, $location, ActorService) {
    $scope.createActor = function (isValid) {
        if (isValid) {
            ActorService.create($scope.actor);

            $location.path('actors/');
        }
    };
});
