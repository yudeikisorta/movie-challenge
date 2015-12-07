challengeApp.controller('ActorListCtrl', function ($scope, ActorService) {
    $scope.pageSize = 10;
    $scope.currentPage = 1;
    $scope.load = true;

    ActorService.getList().then(function (results) {
        $scope.actors = results;
        $scope.load = false;
    });

    $scope.deleteActor = function (idActor) {
        ActorService.delete(idActor).then(function (results) {
            $scope.actors = results;
        });
    };
});
