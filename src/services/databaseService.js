challengeApp.factory('DatabaseService', function($webSql) {
    var db = $webSql.openDatabase('challenge', '1.0', 'Challenge DB', 2 * 1024 * 1024);

    db.createTable('movies', {
        "id":{
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
        },
        "created":{
            "type": "TIMESTAMP",
            "null": "NOT NULL",
            "default": "CURRENT_TIMESTAMP"
        },
        "name":{
            "type": "TEXT",
            "null": "NOT NULL"
        },
        "picture":{
            "type": "TEXT"
        },
        "overview":{
            "type": "TEXT"
        },
        "release_year":{
            "type": "INTEGER",
            "null": "NOT NULL"
        },
        "gross_income":{
            "type": "FLOAT"
        },
        "director":{
            "type": "TEXT"
        },
        "genre":{
            "type": "ARRAY"
        },
        "rating_sum":{
            "type": "INTEGER",
            "default": 0
        },
        "votes_count":{
            "type": "INTEGER",
            "default": 0
        }
    });

    db.createTable('movie_rates', {
        "id_movie":{
            "type": "INTEGER"
        },
        "rate":{
            "type": "INTEGER",
            "default": 0
        }
    });

    db.createTable('movie_actor', {
        "id":{
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
        },
        "id_movie":{
            "type": "INTEGER",
            "null": "NOT NULL"
        },
        "id_actor":{
            "type": "INTEGER",
            "null": "NOT NULL"
        }
    });

    db.createTable('actors', {
        "id":{
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
        },
        "created":{
            "type": "TIMESTAMP",
            "null": "NOT NULL",
            "default": "CURRENT_TIMESTAMP"
        },
        "first_name":{
            "type": "TEXT",
            "null": "NOT NULL"
        },
        "last_name":{
            "type": "TEXT"
        },
        "picture":{
            "type": "TEXT"
        },
        "gender":{
            "type": "TEXT",
            "null": "NOT NULL"
        },
        "birth_date":{
            "type": "TIMESTAMP"
        }
    });

    return db;
});
