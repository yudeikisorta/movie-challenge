challengeApp.controller('MovieListCtrl', function ($scope, $filter, MovieService) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;
        $scope.load = true;

        MovieService.getList().then(function (results) {
            $scope.movies = results;
            $scope.load = false;
        });

        $scope.deleteMovie = function (idMovie) {
            MovieService.delete(idMovie).then(function (results) {
                $scope.movies = results;
            });
        };
    });