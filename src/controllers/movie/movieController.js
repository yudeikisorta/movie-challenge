challengeApp.controller('MovieListCtrl', function ($scope, $filter, MovieService) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        MovieService.getList().then(function (results) {
            $scope.movies = results;
        });

        $scope.deleteMovie = function (idMovie) {
            MovieService.delete(idMovie).then(function (results) {
                $scope.movies = results;
            });
        };
    });