challengeApp.factory('MovieService', function() {
    var factory = {};

    var genre = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 3, name: 'Comedy' },
        { id: 4, name: 'Science fiction' },
        { id: 5, name: 'Historical' },
        { id: 6, name: 'Romance' },
        { id: 7, name: 'Thriller' }
    ];

    factory.getGenreOptions = function() {
        return genre;
    };

    factory.getGenre = function(genres) {
        var items = [];
        if (genres.length){
            angular.forEach(genres, function(elem){
                angular.forEach(genre, function(item){
                    if (item.id == elem) {
                        items.push(item.name);
                    }
                });
            });
        }
        else
            angular.forEach(genre, function(item){
                if (item.id == genres) {
                    items.push(item.name);
                }
            });
        return items;
    };

    return factory;
});