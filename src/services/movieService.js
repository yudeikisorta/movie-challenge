challengeApp.factory('MovieService', function (DatabaseService, $filter) {
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

    factory.getRatingAverage = function (movie) {
        return $filter('number')(movie.rating_sum / movie.votes_count, 1);
    };

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

    factory.select = function (idMovie) {
        return DatabaseService.select('movies', {"id": idMovie})
            .then(function (results) {
                var movie = angular.copy(results.rows.item(0));
                movie.genre = factory.getGenreNames(movie.genre);
                movie.rating = factory.getRatingAverage(movie);

                return movie;
            });
    };

    factory.selectForUpdate = function (idMovie) {
        return DatabaseService.select('movies', {"id": idMovie})
            .then(function (results) {
                var movie = angular.copy(results.rows.item(0));
                if (movie.genre.length)
                    movie.genre = movie.genre.split(',');
                return movie;
            });
    };

    factory.create = function (movie) {
        DatabaseService.insert('movies', movie);
    };

    factory.update = function (movie) {
        DatabaseService.update('movies', movie, {'id': movie.id});
    };

    factory.delete = function (idMovie) {
        return DatabaseService.del("movies", {"id": idMovie})
            .then(function (results) {
                DatabaseService.del("movie_actor", {"id_movie": idMovie});
                DatabaseService.del("movie_rates", {"id_movie": idMovie});

                return factory.getList();
            });
    };

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
                return factory.select(movie.id);
            });
    };

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