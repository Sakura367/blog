var fs = require('fs');
var check_validator = require('../public/js/check_validator.js');
var check_unique = require('../public/js/check_unique.js');

var User, Post;

fs.readFile('./datas/users.txt', function (err, data) {
  if (err) throw err;
  User = JSON.parse(data);
});

fs.readFile('./datas/posts.txt', function (err, data) {
  if (err) throw err;
  Post = JSON.parse(data);
});

var saveUser = function() {
  fs.writeFile('./datas/users.txt', JSON.stringify(User), function (err) {
    if (err) throw err;
  });
};

var saveData = function() {
  fs.writeFile('./datas/posts.txt', JSON.stringify(Post), function (err) {
    if (err) throw err;
  });
};

module.exports.posts = function (req, res) {
  var posts = [];
  Post.posts.forEach(function (post, i) {
    if (!req.session.user) {
      req.session.user = {
        name: "_visitor",
        SuperRole: false,
        CommonRole: false
      }
    }
    posts.push({
      post_num: i,
      title: post.title,
      name: post.name,
      show: post.show,
      ownership: post.name == req.session.user.name,
      SuperRole : req.session.user.SuperRole,
      CommonRole : req.session.user.CommonRole,
      text: post.text.substr(0, 20) + '...'
    });
  });
  res.json({
    posts: posts,
    CommonRole: req.session.user.CommonRole
  });
};

module.exports.post = function (req, res) {
  var post_num = req.params.post_num;
  var tempPost = {};
  tempPost.title = Post.posts[post_num].title;
  tempPost.text = Post.posts[post_num].text;
  tempPost.name = Post.posts[post_num].name;
  tempPost.show = Post.posts[post_num].show;
  tempPost.ownership = Post.posts[post_num].name == req.session.user.name,
  tempPost.SuperRole = req.session.user.SuperRole;
  tempPost.CommonRole = req.session.user.CommonRole;
  tempPost.comments = [];
  Post.posts[post_num].comments.forEach(function (comment, i) {
    tempPost.comments.push({
      comment_num: i,
      text: comment.text,
      name: comment.name,
      ownership: comment.name == req.session.user.name,
      show: comment.show
    });
  });
  if (post_num >= 0 && post_num < Post.posts.length) {
    res.json({
      post: tempPost
    });
  } 
  else {
    res.json(false);
  }
};

module.exports.checkUserRepeat = function (req, res) {
  var newUser = {
    name: req.body.name,
    sid: req.body.sid,
    phone: req.body.phone,
    email: req.body.email
  };
  var result = check_unique.Unique_user.isUserUnique(User, newUser);
  res.json({
    result: result
  });
}

module.exports.signUp = function (req, res) {
  var newUser = {
    name: req.body.name,
    sid: req.body.sid,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  };
  var result = check_validator.Validator_user.isUserValidator(newUser, req.body.repeat);
  if (!result[0] && !result[1] && !result[2] && !result[3] && !result[5]) {
    result = check_unique.Unique_user.isUserUnique(User, newUser);
    console.log(result);
    if (!result[0] && !result[1] && !result[2] && !result[3]) {
      var tempUser = {};
      tempUser.name = req.body.name;
      tempUser.SuperRole = false;
      tempUser.CommonRole = true;
      tempUser.password = req.body.password;
      tempUser.sid = req.body.sid;
      tempUser.phone = req.body.phone;
      tempUser.email = req.body.email;
      User.push(tempUser);
      res.json(true);
      saveUser();
    }
    else res.json(false);
  }
  else res.json(false);
}

module.exports.signIn = function (req, res) {
    for (var i in User) {
      if (User[i].name == req.body.name && User[i].password == req.body.password) {
        req.session.user.name = User[i].name;
        req.session.user.CommonRole = User[i].CommonRole;
        req.session.user.SuperRole = User[i].SuperRole;
        res.json({
          status: true
        });
        return;
      }
    }
    res.json({
      status: false
    });
}

module.exports.signOut = function (req, res) {
  req.session.user.name = '_visitor';
  req.session.user.CommonRole = false;
  req.session.user.SuperRole = false;
  res.json(true);
  saveData();
}


module.exports.addPost = function (req, res) {
  if (req.session.user.CommonRole) {
    req.body.name = req.session.user.name;
    req.body.show = true;
    req.body.comments = [];
    Post.posts.push(req.body);
    res.json(req.body);
    saveData();
  }
  else {
    res.json(false);
  }
};

module.exports.addComment = function (req, res) {
  if (req.session.user.CommonRole) {
    var post_num = req.params.post_num;
    if (post_num >= 0 && post_num < Post.posts.length) {
      req.body.name = req.session.user.name;
      req.body.show = true;
      Post.posts[post_num].comments.push(req.body);
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
}

module.exports.editPost = function (req, res) {
  if (req.session.user.CommonRole) {
    var post_num = req.params.post_num;
    if (post_num >= 0 && post_num < Post.posts.length && req.session.user.name == Post.posts[post_num].name) {
      Post.posts[post_num].title = req.body.title;
      Post.posts[post_num].text = req.body.text;
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
};

module.exports.ShowOrHidePost = function (req, res) {
  if (req.session.user.SuperRole) {
    var post_num = req.params.post_num;
    if (post_num >= 0 && post_num < Post.posts.length) {
      Post.posts[post_num].show = Post.posts[post_num].show === true ? false : true;
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
};

module.exports.editComment = function (req, res) {
  if (req.session.user.CommonRole) {
    var post_num = req.params.post_num;
    var comment_num = req.params.comment_num;
    if (post_num >= 0 && post_num < Post.posts.length
        && comment_num >= 0 && comment_num < Post.posts[post_num].comments.length
            && req.session.user.name == Post.posts[post_num].comments[comment_num].name) {
      Post.posts[post_num].comments[comment_num] = req.body;
      Post.posts[post_num].comments[comment_num].show = true;
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
};

module.exports.ShowOrHideComment = function (req, res) {
  if (req.session.user.SuperRole) {
    var post_num = req.params.post_num;
    var comment_num = req.params.comment_num;
    if (post_num >= 0 && post_num < Post.posts.length && comment_num >= 0 && comment_num < Post.posts[post_num].comments.length ) {
      Post.posts[post_num].comments[comment_num].show = Post.posts[post_num].comments[comment_num].show === true ? false : true;
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
};

module.exports.deletePost = function (req, res) {
  if (req.session.user.CommonRole) {
    var post_num = req.params.post_num;
    if (post_num >= 0 && post_num < Post.posts.length && Post.posts[post_num].name == req.session.user.name) {
        Post.posts.splice(post_num, 1);
        res.json(true);
        saveData();
        return;
    }
  }
  res.json(false);
};

module.exports.deleteComment = function (req, res) {
  if (req.session.user.CommonRole) {
    var post_num = req.params.post_num;
    var comment_num = req.params.comment_num;
    if (post_num >= 0 && post_num < Post.posts.length
        && comment_num >= 0 && comment_num < Post.posts[post_num].comments.length
        && req.session.user.name == Post.posts[post_num].comments[comment_num].name) {
      Post.posts[post_num].comments.splice(comment_num, 1);
      res.json(true);
      saveData();
      return;
    }
  }
  res.json(false);
};
