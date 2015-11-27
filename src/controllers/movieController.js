challengeApp.filter('range', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    })

    .filter('getGenre', function () {
        return function (id, input) {
            var i = 0, len = input.length;
            for (i = 0; i < len; i++) {
                if (input[i].id == id) {
                    return input[i].name;
                }
            }
            return null;
        };
    })

    .controller('MovieListCtrl', function ($scope, $filter, DatabaseService) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        var getList = function () {
            DatabaseService.selectAll('movies').then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    var movie = results.rows.item(i);
                    movie.rating = $filter('number')(movie.rating_sum / movie.votes_count, 1);
                    items.push(movie);
                }
                $scope.movies = items;
            });
        };

        getList();

        $scope.deleteMovie = function ($idMovie) {
            DatabaseService.del("movies", {"id": $idMovie}).then(function (results) {
                getList();

                DatabaseService.select('movie_actor', {"id_movie": $idMovie}).then(function (results) {
                    for (var i = 0; i < results.rows.length; i++) {
                        var item = results.rows.item(i);
                        DatabaseService.del("movie_actor", {"id": item.id});
                    }
                });

                DatabaseService.select('movie_rates', {"id_movie": $idMovie}).then(function (results) {
                    for (var i = 0; i < results.rows.length; i++) {
                        var item = results.rows.item(i);
                        DatabaseService.del("movie_rates", {"id": item.id});
                    }
                });
            });
        };
    })

    .controller('MovieDetailCtrl', function ($scope, $routeParams, $filter, MovieService, DatabaseService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        DatabaseService.select('movies', {"id": $routeParams.id}).then(function (results) {
            var movie = angular.copy(results.rows.item(0));
            $scope.movie = movie;
            $scope.movie.genre = MovieService.getGenre(movie.genre);

            $scope.movie.rating = $filter('number')(movie.rating_sum / movie.votes_count, 1);
        });

        DatabaseService.select('movie_rates', {"id_movie": $routeParams.id}).then(function (results) {
            $scope.last_rate = 0;
            if (results.rows.length) {
                var index = results.rows.length - 1;
                $scope.last_rate = results.rows.item(index).rate;
            }
        });

        DatabaseService.executeQuery('SELECT actors.* FROM actors ' +
                'INNER JOIN movie_actor ON movie_actor.id_actor = actors.id ' +
                'WHERE movie_actor.id_movie = ?', [$routeParams.id]).then(function (results) {
            var items = [];
            for (var i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
            }
            $scope.actors = items;
        });

        $scope.updateRating = function (rate) {
            DatabaseService.insert('movie_rates', {'id_movie': $scope.movie.id, 'rate': rate});

            var votes = $scope.movie.votes_count + 1;
            var rating_sum = $scope.movie.rating_sum + rate;
            var params = {
                'votes_count': votes,
                'rating_sum': rating_sum
            };
            DatabaseService.update('movies', params, {'id': $scope.movie.id}).then(function (results) {
                DatabaseService.select('movies', {"id": $scope.movie.id}).then(function (results) {
                    var movie = results.rows.item(0);
                    movie.genre = MovieService.getGenre(movie.genre);

                    movie.rating = $filter('number')(movie.rating_sum / movie.votes_count, 1);
                    $scope.movie = movie;
                });
            });
        };
    })

    .controller('MovieNewCtrl', function ($scope, $location, MovieService, DatabaseService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        $scope.createMovie = function (isValid) {
            if (isValid) {
                DatabaseService.insert('movies', $scope.movie);

                $location.path('movies/');
            }
        };
    })

    .controller('MovieEditCtrl', function ($scope, $routeParams, $location, MovieService, DatabaseService) {
        $scope.genreOptions = MovieService.getGenreOptions();

        DatabaseService.select('movies', {"id": $routeParams.id}).then(function (results) {
            var movie = angular.copy(results.rows.item(0));
            $scope.movie = movie;
            if (movie.genre.length)
                $scope.movie.genre = movie.genre.split(',');
            else
                $scope.movie.genre = movie.genre;
        });

        $scope.updateMovie = function (isValid) {
            if (isValid) {
                DatabaseService.update('movies', $scope.movie, {'id': $scope.movie.id});

                $location.path('movies/');
            }
        };
    })

    .controller('MovieEditActorsCtrl', function ($scope, $routeParams, DatabaseService) {
        DatabaseService.select('movies', {"id": $routeParams.id}).then(function (results) {
            $scope.movie = results.rows.item(0);
        });

        var getFilteredActors = function () {
            DatabaseService.executeQuery('SELECT actors.* FROM actors ' +
                    'INNER JOIN movie_actor ON movie_actor.id_actor = actors.id ' +
                    'WHERE movie_actor.id_movie = ?', [$routeParams.id]).then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    items.push(results.rows.item(i));
                }
                $scope.filteredActors = items;
            });
        };

        getFilteredActors();

        var getActors = function() {
            DatabaseService.selectAll('actors').then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    items.push(results.rows.item(i));
                }
                $scope.actors = items;
            });
        };

        getActors();

        $scope.createActor = function () {
            DatabaseService.insert('actors', $scope.actor).then(function (item) {
                var $object = {
                    'id_movie': $routeParams.id,
                    'id_actor': item.insertId
                };
                DatabaseService.insert('movie_actor', $object).then(function (item) {
                    getFilteredActors();
                    getActors();
                    $scope.actor = null;
                    $scope.actorForm.$setPristine(true);
                    $scope.actorForm.$setUntouched(true);
                });
            });


        };

        $scope.addActor = function () {
            if ($scope.selectedActor) {
                var $object = {
                    'id_movie': $routeParams.id,
                    'id_actor': $scope.selectedActor
                };
                DatabaseService.insert('movie_actor', $object).then(function (item) {
                    getFilteredActors();
                });
            }
        };

        $scope.removeActorFromMovie = function (idActor) {
            DatabaseService.select('movie_actor', {"id_movie": {"value": $routeParams.id, "union": "AND"}, "id_actor": idActor}).then(function (results) {
                var movie_actor = results.rows.item(0);

                DatabaseService.del("movie_actor", {"id": movie_actor.id}).then(function (results) {
                    getFilteredActors();
                });
            });
        };
    });