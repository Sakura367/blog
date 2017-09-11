angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'details/index',
        controller: indexController
      }).
      when('/addPost', {
        templateUrl: 'details/addPost',
        controller: addPostController
      }).
      when('/readPost/:post_num', {
        templateUrl: 'details/readPost',
        controller: readPostController
      }).
      when('/editPost/:post_num', {
        templateUrl: 'details/editPost',
        controller: editPostController
      }).
      when('/deletePost/:post_num', {
        templateUrl: 'details/deletePost',
        controller: deletePostController
      }).
      when('/readPost/:post_num/editComment/:comment_num', {
        templateUrl: 'details/editComment',
        controller: editCommentController
      }).
      when('/readPost/:post_num/deleteComment/:comment_num', {
        templateUrl: 'details/deleteComment',
        controller: deleteCommentController
      }).
      when('/signIn', {
        templateUrl: 'details/signIn',
        controller: signInController
      }).
      when('/signUp', {
        templateUrl: 'details/signUp',
        controller: signUpController
      }).
      when('/signOut', {
        templateUrl: 'details/signOut',
        controller: signOutController
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);