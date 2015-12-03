challengeApp.controller('ActorListCtrl', function ($scope, ActorService) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        ActorService.getList().then(function (results) {
            $scope.actors = results;
        });

        $scope.deleteActor = function (idActor) {
            ActorService.delete(idActor).then(function (results) {
                $scope.actors = results;
            });
        };
    })

    .controller('ActorDetailCtrl', function ($scope, $routeParams, MovieService, ActorService) {
        ActorService.select($routeParams.id).then(function (actor) {
            $scope.actor = actor;
        });

        MovieService.getMoviesByActor($routeParams.id).then(function (results) {
            $scope.movies = results;
        });
    })

    .controller('ActorNewCtrl', function ($scope, $location, ActorService) {
        $scope.createActor = function (isValid) {
            if (isValid) {
                ActorService.create($scope.actor);

                $location.path('actors/');
            }
        };
    })

    .controller('ActorEditCtrl', function ($scope, $routeParams, $location, $filter, ActorService) {
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