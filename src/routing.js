challengeApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider.
            when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            }).
            when('/movies', {
                templateUrl: 'partials/movie-list.html',
                controller: 'MovieListCtrl'
            }).
            when('/movies/create', {
                templateUrl: 'partials/movie-new.html',
                controller: 'MovieNewCtrl'
            }).
            when('/movies/edit/:id', {
                templateUrl: 'partials/movie-new.html',
                controller: 'MovieEditCtrl'
            }).
            when('/movies/detail/:id', {
                templateUrl: 'partials/movie-detail.html',
                controller: 'MovieDetailCtrl'
            }).
            when('/movies/edit/:id/actors', {
                templateUrl: 'partials/movie-actors.html',
                controller: 'MovieEditActorsCtrl'
            }).
            when('/actors', {
                templateUrl: 'partials/actor-list.html',
                controller: 'ActorListCtrl'
            }).
            when('/actors/create', {
                templateUrl: 'partials/actor-new.html',
                controller: 'ActorNewCtrl'
            }).
            when('/actors/edit/:id', {
                templateUrl: 'partials/actor-new.html',
                controller: 'ActorEditCtrl'
            }).
            when('/actors/detail/:id', {
                templateUrl: 'partials/actor-detail.html',
                controller: 'ActorDetailCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });

        /*$locationProvider.html5Mode({
         enabled: true,
         requireBase: false
         })*/
    }]);
