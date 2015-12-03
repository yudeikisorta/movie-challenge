challengeApp.filter('range', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    })

    .controller('MovieListCtrl', function ($scope, $filter, MovieService) {
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
    })

    .controller('MovieDetailCtrl', function ($scope, $routeParams, $filter, MovieService, ActorService) {
        MovieService.select($routeParams.id).then(function (movie) {
            $scope.movie = movie;
        });

        MovieService.getMovieLastRate($routeParams.id).then(function (item) {
            $scope.last_rate = item;
        });

        ActorService.getActorsByMovie($routeParams.id).then(function (results) {
            $scope.actors = results;
        });

        $scope.updateRating = function (rate) {
            MovieService.updateRating($scope.movie, rate).then(function (movie) {
                $scope.movie = movie;
            });
        };
    })

    .controller('MovieNewCtrl', function ($scope, $location, MovieService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        $scope.createMovie = function (isValid) {
            if (isValid) {
                MovieService.create($scope.movie);

                $location.path('movies/');
            }
        };
    })

    .controller('MovieEditCtrl', function ($scope, $routeParams, $location, MovieService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        MovieService.selectForUpdate($routeParams.id).then(function (movie) {
            $scope.movie = movie;
        });

        $scope.updateMovie = function (isValid) {
            if (isValid) {
                MovieService.update($scope.movie);

                $location.path('movies/');
            }
        };
    })

    .controller('MovieEditActorsCtrl', function ($scope, $routeParams, MovieService, ActorService) {
        MovieService.select($routeParams.id).then(function (movie) {
            $scope.movie = movie;
        });

        var getFilteredActors = function () {
            ActorService.getActorsByMovie($routeParams.id).then(function (results) {
                $scope.filteredActors = results;
            });
        };

        var getActors = function () {
            ActorService.getList().then(function (results) {
                $scope.actors = results;
            });
        };

        getActors();
        getFilteredActors();

        $scope.createActor = function () {
            ActorService.create($scope.actor, $routeParams.id).then(function () {
                getFilteredActors();
                getActors();
                $scope.actor = null;
                $scope.actorForm.$setPristine(true);
                $scope.actorForm.$setUntouched(true);
            });
        };

        $scope.addActor = function () {
            if ($scope.selectedActor) {
                ActorService.addActorToMovie($scope.selectedActor, $routeParams.id).then(function () {
                    getFilteredActors();
                });
            }
        };

        $scope.removeActorFromMovie = function (idActor) {
            ActorService.removeActorFromMovie(idActor, $routeParams.id).then(function () {
                getFilteredActors();
            });
        };
    });