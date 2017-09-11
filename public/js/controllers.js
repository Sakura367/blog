function signUpController($scope, $http, $location) {
  $scope.form = {};
  $scope.errNameFlag = $scope.errSidFlag = $scope.errPhoneFlag = $scope.errEmaileFlag = false;
  $scope.errPasswordFlag = $scope.errRepeatFlag = true;
      $scope.errName = function () {
    if (!$scope.form.name) return false;
    var res = Validator_user.check_name($scope.form.name);
    if (res) {
      $scope.errNameMessage = res;
      return true;
    }
  };
  $scope.errSid = function () {
    if (!$scope.form.sid) return false;
    var res = Validator_user.check_sid($scope.form.sid);
    if (res) {
      $scope.errSidMessage = res;
      return true;
    }
  };
  $scope.errPhone = function () {
    if (!$scope.form.phone) return false;
    var res = Validator_user.check_phone($scope.form.phone);
    if (res) {
      $scope.errPhoneMessage = res;
      return true;
    }
  };
  $scope.errEmail = function () {
    if (!$scope.form.email) return false;
    var res = Validator_user.check_email($scope.form.email);
    if (res) {
      $scope.errEmailMessage = res;
      return true;
    }
  };
  $scope.errPassword = function () {
    if (!$scope.form.password) return false;
    var res = Validator_user.check_password($scope.form.password);
    if (res) {
      $scope.errPasswordMessage = res;
      return true;
    }
  };
  $scope.errRepeat = function () {
    if (!$scope.form.repeat) return false;
    var res = Validator_user.check_same_password($scope.form.password, $scope.form.repeat);
    if (res) {
      $scope.errRepeatMessage = res;
      return true;
    }
  };
  
  $scope.signUp = function() {
    if ($scope.form.name && $scope.form.password && $scope.form.repeat && $scope.form.sid && $scope.form.phone && $scope.form.email && !$scope.errName() && !$scope.errSid() && !$scope.errPhone() && !$scope.errEmail() && !$scope.errPassword() && !$scope.errRepeat()) {
      $http.post('/api/checkUserRepeat', $scope.form).
        success(function(data) {
          if (!data.result[0] && !data.result[1] && !data.result[2] && !data.result[3]) {
            $scope.errNameFlag = $scope.errPasswordFlag = $scope.errRepeatFlag = $scope.errSidFlag = $scope.errPhoneFlag = $scope.errEmaileFlag = false;
            $scope.errNameMessage = $scope.errPasswordMessage = $scope.errRepeatMessage = $scope.errSidMessage = $scope.errPhoneMessage = $scope.errEmaileMessage = '';
            $scope.form.password = md5($scope.form.password);
            $scope.form.repeat = md5($scope.form.repeat);
            $http.post('/api/signUp', $scope.form).
            success(function(data) {
              alert('Sign up succeeded!');
              $location.url('/signIn');
            }).
            error(function() {
              alert('Sign up failed!');
            });
          }
          else {
            if (data.result[0]) {
              $scope.errNameFlag = true;
              $scope.errNameMessage = data.result[0];
            }
            if (data.result[1]) {
              $scope.errSidFlag = true;
              $scope.errSidMessage = data.result[1];
            }
            if (data.result[2]) {
              $scope.errPhoneFlag = true;
              $scope.errPhoneMessage = data.result[2];
            }
            if (data.result[3]) {
              $scope.errEmailFlag = true;
              $scope.errEmailMessage = data.result[3];
            }
          }
        }).
        error(function() {
          alert('Sign up error!');
        });
    }
  };
}


function signOutController($scope, $http, $location) {
  $scope.signOut = function() {
    $http.put('/api/signOut').
      success(function(data) {
        alert('Sign out succeeded!');
        $location.url('/');
      }).
      error(function() {
        alert('Sign out failed!');
      });
  };

  $scope.home = function() {
    $location.url('/');
  }
}

function signInController($scope, $http, $location) {
  $scope.errFlag = false;
  $scope.errMessage = "";
  $scope.signIn = function() {
    $scope.form.password = md5($scope.form.password);
    $http.put('/api/signIn', $scope.form).
      success(function(data) {
        if (data.status) {
          $scope.errFlag = false;
          $scope.errMessage = '';
          alert('Sign in succeeded!');
          $location.url('/');
        }
        else {
          $scope.errFlag = true;
          if ($scope.form.name == undefined || $scope.form.name == '')
            $scope.errMessage = "User name can't be empty!";
          else
            $scope.errMessage = 'User ' + $scope.form.name + " doesn't exsit or errors on name or password";
          alert('Sign in failed!');
        }
      }).
      error(function(data) {
        $scope.errFlag = true;
        $scope.errMessage = 'User ' + $scope.form.name + " doesn't exsit or errors on name or password";
        alert('Sign in failed!');
      });
  }
    
}

function indexController($scope, $http) {
  $http.get('/api/posts').
    success(function(data) {
      $scope.posts = data.posts;
      $scope.CommonRole = data.CommonRole;
    });

  $scope.ShowOrHidePost = function(post_num) {
    $http.put('/api/post/' + post_num + '/ShowOrHidePost').
      success(function(data) {
        $http.get('/api/posts').
          success(function(data) {
            $scope.posts = data.posts;
          });
      });
  };
}

function editCommentController($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.post_num).
    success(function(data) {
      $scope.form = data.post.comments[$routeParams.comment_num];
    });

  $scope.editComment = function () {
    $http.put('/api/post/' + $routeParams.post_num + '/editComment/' + $routeParams.comment_num, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.post_num);
      });
  };
}

function addPostController($scope, $http, $location) {
  $scope.submitPost = function () {
    $http.post('/api/addpost', $scope.form).
      success(function(data) {
        $location.url('/');
      });
  };
}

function readPostController($scope, $http, $routeParams) {
  $scope.post_num = $routeParams.post_num;
  $http.get('/api/post/' + $routeParams.post_num).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.submitComment = function (CommonRole) {
    if (CommonRole) {
      $http.post('/api/post/' + $routeParams.post_num + '/addComment', $scope.form).
        success(function(data) {
          $http.get('/api/post/' + $routeParams.post_num).
            success(function(data) {
              $scope.post = data.post;
            });
        });
    } else {
      alert('Please sign in first!');
      return false;
    }
  };

  $scope.ShowOrHideComment = function(comment_num) {
    $http.put('/api/post/' + $routeParams.post_num + '/ShowOrHideComment/' + comment_num).
      success(function(data) {
        $http.get('/api/post/' + $routeParams.post_num).
          success(function(data) {
            $scope.post = data.post;
          });
      });
  };
}

function editPostController($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.post_num).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    if ($scope.form.CommonRole) {
      $http.put('/api/editpost/' + $routeParams.post_num, $scope.form).
        success(function(data) {
          $location.url('/');
       });
    }
    else {
      alert('You have no rights to edit it.');
      return false;
    }
  };
}

function deletePostController($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.post_num).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    if ($scope.post.CommonRole) {
      $http.delete('/api/deletepost/' + $routeParams.post_num).
        success(function(data) {
          $location.url('/');
        });
    }
    else {
      alert('You have no rights to delete it.')
      return false;
    }
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function deleteCommentController($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.post_num).
  success(function(data) {
    $scope.post = data.post;
    $scope.comment = data.post.comment[$routeParams.comment_num];
  });
  
  $scope.deleteComment = function () {
    if ($scope.post.CommonRole) {
      $http.delete('/api/post/' + $routeParams.post_num + '/deleteComment/' + $routeParams.comment_num).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.post_num);
      });
    } 
    else {
      alert('You have no rights to delete it.')
      return false;
    }
  };
  
  $scope.home = function () {
    $location.url('/');
  };
}
