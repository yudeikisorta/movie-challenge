challengeApp.controller('HomeCtrl', function ($scope, MovieService, DatabaseService) {
    $scope.genreOptions = MovieService.getGenreOptions();

    DatabaseService.executeQuery('SELECT * FROM movies ORDER BY id DESC LIMIT 0,10').then(function (results) {
        var items = [];
        for (var i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
        }
        $scope.movies = items;
    });
});