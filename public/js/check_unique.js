var Unique_user = {
    switch_to_conduct: function (users, str, key) {
        switch(key) {
            case 'name' : this.check_name(users, str);break;
            case 'sid' : this.check_sid(users, str);break;
            case 'phone' : this.check_phone(users, str);break;
            case 'email' : this.check_email(users, str);break;
            default: break;
        }
    },
    check_name: function (users, str) {
        for (var i in users) {
            if (users[i].name == str) {
                return 'This name exist';
            }
        }
    },
    check_sid: function (users, str) {
        for (var i in users) {
            if (users[i].sid == str) {
                return 'This sid exist';
            }
        }
    },
    check_phone: function (users, str) {
        for (var i in users) {
            if (users[i].phone == str) {
                return 'This phone exist';
            }
        }
    },
    check_email: function (users, str) {
        for (var i in users) {
            if (users[i].email == str) {
                return 'This email exist';
            }
        }
    },
    isUserUnique: function (users, newuser) {
        var result = ['', '', '', ''];
        for (var i = 0; i < users.length; i++) {
            if (result[0] != '' || result[1] != '' || result[2] != '' || result[3] != '') break;
            (function (i) {
                if (users[i].name == newuser.name) result[0] = 'This name exist';
                if (users[i].sid == newuser.sid) result[1] = 'This sid exist';
                if (users[i].phone == newuser.phone) result[2] = 'This phone exist';
                if (users[i].email == newuser.email) result[3] = 'This email exist';
            })(i);
        }
        return result;
    }
};

module.exports.Unique_user = Unique_user;