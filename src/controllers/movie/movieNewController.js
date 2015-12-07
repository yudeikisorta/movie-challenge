challengeApp.controller('MovieNewCtrl', function ($scope, $location, MovieService, ActorService) {
    $scope.genreOptions = MovieService.getGenreOptions();
    $scope.movie = {};
    $scope.movieActors = [];

    var getFilteredActors = function () {
        ActorService.getFilteredActors($scope.movieActors).then(function(results){
            $scope.actors = results;
        });
    };

    getFilteredActors();

    $scope.getImage = function () {
        if ($scope.file) {
            $scope.movie.picture = $scope.file.base64;
        }
    };

    $scope.createMovie = function (isValid) {
        if (isValid) {
            MovieService.create($scope.movie).then(function (result) {
                if($scope.movieActors.length){
                    angular.forEach($scope.movieActors, function (elem) {
                        ActorService.addActorToMovie(elem.id, result.insertId);
                    });
                }
            });

            $location.path('movies/');
        }
    };

    $scope.addActor = function () {
        if ($scope.selectedActor) {
            ActorService.select($scope.selectedActor).then(function (item) {
                $scope.movieActors.push(item);
                getFilteredActors();
            });
        }
    };

    $scope.removeActorFromMovie = function (index) {
       $scope.movieActors.splice(index, 1);
        getFilteredActors();
    };
});