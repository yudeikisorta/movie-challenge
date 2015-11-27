challengeApp.filter('range', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    })

    .controller('ActorListCtrl', function ($scope, DatabaseService) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        var getList = function () {
            DatabaseService.selectAll('actors').then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    items.push(results.rows.item(i));
                }
                $scope.actors = items;
            });
        };

        getList();

        $scope.deleteActor = function ($idActor) {
            DatabaseService.del("actors", {"id": $idActor}).then(function (results) {
                getList();

                DatabaseService.select('movie_actor', {"id_actor": $idActor}).then(function (results) {
                    for (var i = 0; i < results.rows.length; i++) {
                        var item = results.rows.item(i);
                        DatabaseService.del("movie_actor", {"id": item.id});
                    }
                });
            });
        };
    })

    .controller('ActorDetailCtrl', function ($scope, $routeParams, MovieService, DatabaseService) {
        DatabaseService.select('actors', {"id": $routeParams.id}).then(function (results) {
            $scope.actor = angular.copy(results.rows.item(0));
        });

        DatabaseService.executeQuery('SELECT movies.* FROM movies ' +
                'LEFT JOIN movie_actor ON movie_actor.id_movie = movies.id ' +
                'WHERE movie_actor.id_actor = ?', [$routeParams.id]).then(function (results) {
            var items = [];
            for (var i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
            }
            $scope.movies = items;
        });
    })

    .controller('ActorNewCtrl', function ($scope, $location, DatabaseService) {
        $scope.createActor = function (isValid) {
            if (isValid) {
                DatabaseService.insert('actors', $scope.actor);

                $location.path('actors/');
            }
        };
    })

    .controller('ActorEditCtrl', function ($scope, $routeParams, $location, $filter, DatabaseService) {
        DatabaseService.select('actors', {"id": $routeParams.id}).then(function (results) {

            $scope.actor = angular.copy(results.rows.item(0));
        });

        $scope.updateActor = function (isValid) {
            if (isValid) {
                DatabaseService.update('actors', $scope.actor, {'id': $scope.actor.id});

                $location.path('actors/');
            }
        };
    });