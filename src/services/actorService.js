challengeApp.factory('ActorService', function (DatabaseService) {
    var factory = {};

    /* Get actors for the specified movie */
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

    /* Filter actors and return actors which are not in the list */
    factory.getFilteredActors = function (actorsList) {
        var ids = [];
        angular.forEach(actorsList, function (elem) {
            ids.push(elem.id);
        });

        return DatabaseService.executeQuery('SELECT * FROM actors WHERE actors.id NOT IN (' + ids.join(',') + ')', [])
            .then(function (results) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    items.push(results.rows.item(i));
                }
                return items;
            });
    };

    /* Get list of actors */
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

    /* Select an specific actor */
    factory.select = function (idActor) {
        return DatabaseService.select('actors', {"id": idActor}).then(function (results) {
            return angular.copy(results.rows.item(0));
        });
    };

    /* Create a new actor */
    factory.create = function (actor, idMovie) {
        if (idMovie) {
            return DatabaseService.insert('actors', actor)
                .then(function (item) {
                    var $object = {
                        'id_movie': idMovie,
                        'id_actor': item.insertId
                    };
                    return DatabaseService.insert('movie_actor', $object);
                });
        } else {
            return DatabaseService.insert('actors', actor);
        }
    };

    /* Update the specified actor */
    factory.update = function (actor) {
        DatabaseService.update('actors', actor, {'id': actor.id});
    };

    /* Delete the specified actor */
    factory.delete = function (idActor) {
        return DatabaseService.del("actors", {"id": idActor})
            .then(function (results) {
                DatabaseService.del("movie_actor", {"id_actor": idActor});

                return factory.getList();
            });
    };

    /* Add actors to the specified movie */
    factory.addActorToMovie = function (actor, idMovie) {
        var $object = {
            'id_movie': idMovie,
            'id_actor': actor
        };
        return DatabaseService.insert('movie_actor', $object);
    };

    /* Remove actors from the specified movie */
    factory.removeActorFromMovie = function (idActor, idMovie) {
        return DatabaseService.del("movie_actor", {"id_movie": {"value": idMovie, "union": "AND"}, "id_actor": idActor});
    };

    return factory;
});
