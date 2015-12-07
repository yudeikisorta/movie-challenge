challengeApp.factory('MovieService', function (DatabaseService, ActorService, $filter) {
    var factory = {};

    var genre = [
        {id: 1, name: 'Action'},
        {id: 2, name: 'Adventure'},
        {id: 3, name: 'Comedy'},
        {id: 4, name: 'Science fiction'},
        {id: 5, name: 'Historical'},
        {id: 6, name: 'Romance'},
        {id: 7, name: 'Thriller'}
    ];

    factory.getGenreOptions = function () {
        return genre;
    };

    /* Get a list of genre names */
    factory.getGenreNames = function (genresIds) {
        var items = [];
        if (genresIds.length) {
            angular.forEach(genresIds, function (elem) {
                angular.forEach(genre, function (item) {
                    if (item.id == elem) {
                        items.push(item.name);
                    }
                });
            });
        }
        else
            angular.forEach(genre, function (item) {
                if (item.id == genresIds) {
                    items.push(item.name);
                }
            });
        return items;
    };

    /* Determine rating average */
    factory.getRatingAverage = function (movie) {
        return $filter('number')(movie.rating_sum / movie.votes_count, 1);
    };

    /* Get list of movies */
    factory.getList = function () {
        return DatabaseService.selectAll('movies')
            .then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    var movie = results.rows.item(i);
                    movie.rating = factory.getRatingAverage(movie);
                    items.push(movie);
                }
                return items;
            });
    };

    /* Select an specific movie and clear all the relations lists if this param is specified */
    factory.select = function (idMovie, relations) {
        return DatabaseService.select('movies', {"id": idMovie})
            .then(function (results) {
                var movie = angular.copy(results.rows.item(0));
                movie.genreNames = factory.getGenreNames(movie.genre);
                movie.rating = factory.getRatingAverage(movie);

                if (relations) {
                    relatedMovies = [];
                    ids = [];
                }

                return movie;
            });
    };

    var relatedMovies = [];
    var ids = [];

    /*  Get related movies by genre */
    factory.getRelatedMovies = function (movie, j) {
        var genre = JSON.parse("[" + movie.genre + "]");
        return DatabaseService.executeQuery('SELECT * FROM movies WHERE movies.genre LIKE "%' + genre[j] + '%" AND movies.id !=' + movie.id).then(function (results) {

            for (var i = 0; i < results.rows.length; i++) {
                if (ids.indexOf(results.rows.item(i).id) == -1) {
                    relatedMovies.push(results.rows.item(i));
                    ids.push(results.rows.item(i).id);
                }
            }
            if (genre.length - 1 >= j + 1) {
                return factory.getRelatedMovies(movie, j + 1);
            }
            else {
                movie.relatedMovies = relatedMovies;
                return movie;
            }
        });
    };

    /* Get related movies by actor */
    factory.relatedMoviesByActor = function (movie) {
        return ActorService.getActorsByMovie(movie.id).then(function (results) {
            if(results.length){
                var actorString = '';
                angular.forEach(results, function (elem, index) {
                    if (index === 0) {
                        actorString += 'movie_actor.id_actor = ' + elem.id;
                    } else {
                        actorString += ' OR movie_actor.id_actor = ' + elem.id;
                    }
                });

                var ids = [];
                var movies = [];
                return DatabaseService.executeQuery('SELECT movies.* FROM movies INNER JOIN movie_actor ON movies.id=movie_actor.id_movie ' +
                        'WHERE (' + actorString + ') AND movies.id != ?', [movie.id])
                    .then(function (results) {
                        for (var i = 0; i < results.rows.length; i++) {
                            var item = results.rows.item(i);
                            if (ids.indexOf(item.id) == -1) {
                                movies.push(item);
                                ids.push(item.id);
                            }
                        }
                        return movies;
                    });
            }
        });
    };

    /* Select an specific movie for updating */
    factory.selectForUpdate = function (idMovie) {
        return DatabaseService.select('movies', {"id": idMovie})
            .then(function (results) {
                var movie = angular.copy(results.rows.item(0));
                if (movie.genre.length)
                    movie.genre = movie.genre.split(',');
                return movie;
            });
    };

    /* Create a new movie */
    factory.create = function (movie) {
        return DatabaseService.insert('movies', movie);
    };

    /* Update the specified movie */
    factory.update = function (movie) {
        return DatabaseService.update('movies', movie, {'id': movie.id});
    };

    /* Delete the specified movie */
    factory.delete = function (idMovie) {
        return DatabaseService.del("movies", {"id": idMovie})
            .then(function (results) {
                DatabaseService.del("movie_actor", {"id_movie": idMovie});
                DatabaseService.del("movie_rates", {"id_movie": idMovie});

                return factory.getList();
            });
    };

    /* Get last rate of the movie */
    factory.getMovieLastRate = function (idMovie) {
        return DatabaseService.select('movie_rates', {"id_movie": idMovie})
            .then(function (results) {
                var last_rate = 0;
                if (results.rows.length) {
                    var index = results.rows.length - 1;
                    last_rate = results.rows.item(index).rate;
                }

                return last_rate;
            });
    };

    /* Update rating for the specified movie */
    factory.updateRating = function (movie, rate) {
        DatabaseService.insert('movie_rates', {'id_movie': movie.id, 'rate': rate});

        var votes = movie.votes_count + 1;
        var rating_sum = movie.rating_sum + rate;
        var params = {
            'votes_count': votes,
            'rating_sum': rating_sum
        };
        return DatabaseService.update('movies', params, {'id': movie.id})
            .then(function (results) {
                movie.votes_count = votes;
                movie.rating_sum = rating_sum;
                movie.rating = factory.getRatingAverage(movie);
                return movie;
            });
    };

    /* Get movies for the specified actor */
    factory.getMoviesByActor = function (idActor) {
        return DatabaseService.executeQuery('SELECT movies.* FROM movies ' +
                'LEFT JOIN movie_actor ON movie_actor.id_movie = movies.id ' +
                'WHERE movie_actor.id_actor = ?', [idActor]).then(function (results) {
            var items = [];
            for (var i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
            }
            return items;
        });
    };

    return factory;
});