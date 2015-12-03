challengeApp.factory('ActorService', function (DatabaseService) {
    var factory = {};

    factory.getActorsByMovie = function (idMovie) {
        return DatabaseService.executeQuery('SELECT actors.* FROM actors ' +
            'INNER JOIN movie_actor ON movie_actor.id_actor = actors.id ' +
            'WHERE movie_actor.id_movie = ?', [idMovie]).then(function (results) {
            var items = [];
            for (var i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
            }
            return items;
        });
    };

    factory.getList = function () {
        return DatabaseService.selectAll('actors')
            .then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    items.push(results.rows.item(i));
                }
                return items;
            });
    };

    factory.select = function (idActor) {
        return DatabaseService.select('actors', {"id": idActor}).then(function (results) {
            return angular.copy(results.rows.item(0));
        });
    };

    factory.create = function (actor, idMovie) {
        return DatabaseService.insert('actors', actor)
            .then(function (item) {
                if (idMovie) {
                    var $object = {
                        'id_movie': idMovie,
                        'id_actor': item.insertId
                    };
                    return DatabaseService.insert('movie_actor', $object);
                }

            });
    };

    factory.update = function (actor) {
        DatabaseService.update('actors', actor, {'id': actor.id});
    };

    factory.delete = function (idActor) {
        return DatabaseService.del("actors", {"id": idActor})
            .then(function (results) {
                DatabaseService.del("movie_actor", {"id_actor": idActor});

                return factory.getList();
            });
    };

    factory.addActorToMovie = function (actor, idMovie) {
        var $object = {
            'id_movie': idMovie,
            'id_actor': actor
        };
        return DatabaseService.insert('movie_actor', $object);
    };

    factory.removeActorFromMovie = function (idActor, idMovie) {
        return DatabaseService.del("movie_actor", {"id_movie": {"value": idMovie, "union": "AND"}, "id_actor": idActor})
    };

    return factory;
});
