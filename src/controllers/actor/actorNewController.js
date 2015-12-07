challengeApp.controller('ActorNewCtrl', function ($scope, $location, ActorService) {
    $scope.actor = {};

    $scope.getImage = function () {
        if ($scope.file) {
            $scope.actor.picture = $scope.file.base64;
        }
    };

    $scope.createActor = function (isValid) {
        if (isValid) {
            ActorService.create($scope.actor);

            $location.path('actors/');
        }
    };
});
