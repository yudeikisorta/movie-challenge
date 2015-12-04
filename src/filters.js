challengeApp.filter('capitalize', function() {
        return function(input, scope) {
            if (input && input !== null){
                input = input.toLowerCase();
                return input.substring(0,1).toUpperCase()+input.substring(1);
            }
            return input;
        };
    })

    .filter('range', function () {
        return function (input, min, max) {
            min = parseInt(min);
            max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    });
