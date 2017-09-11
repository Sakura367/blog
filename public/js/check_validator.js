var Validator_user = {
    check_name: function (name) {
        if (!name) return 'Name can not be empty';
        else if (name.length < 6) return 'Length of the name must be larger than 6';
        else if (name.length > 18) return 'Length of the name must be smaller than 12';
        else if (name[0].match(/^[a-zA-Z]$/) == null) return 'Name must start with a letter';
        else if (name.match(/^[a-zA-Z]\w{5,17}$/) == null) return 'Name must be number, letter, _';
    },
    check_sid: function (sid) {
        if (!sid) return 'Sid can not be empty';
        else if (sid.length != 8) return 'Length of the sid must be 8';
        else if (sid[0].match(/^[0]$/) != null) return 'Sid can not start with 0';
        else if (sid.match(/^[^0]\d{7}$/) == null) return 'Phone must be number';
    },
    check_phone: function (phone) {
        if (!phone) return 'Phone can not be empty';
        else if (phone.length != 11) return 'Length of the phone must be 11';
        else if (phone[0].match(/^[0]$/) != null) return 'Phone can not start with 0';
        else if (phone.match(/^[^0]\d{10}$/) == null) return 'Phone must be number';
    },
    check_email: function (email) {
        if (!email) return 'Email can not be empty';
        else if (email.match(/^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/) == null) return 'Email illegal';
    },
    check_password: function (password) {
        if (!password) return 'Password can not be empty';
        else if (password.length < 6) return 'Length of the password must be larger than 6';
        else if (password.length > 12) return 'Length of the password must be smaller than 12';
        else if (password.match(/^[0-9a-zA-Z_\-]{6,12}$/) == null) return 'Password must be number, letter, -, _';
    },
    check_same_password(password, repeat) {
        if (password == repeat && password && repeat) return '';
        else return 'Different password';
    },
    isUserValidator: function (newuser, repeat) {
        var result = ['', '', '', '', ''];
        result[0] = this.check_name(newuser.name);
        result[1] = this.check_sid(newuser.sid);
        result[2] = this.check_phone(newuser.phone);
        result[3] = this.check_email(newuser.email);
        result[4] = this.check_password(newuser.password);
        result[5] = this.check_same_password(newuser.password, repeat);
        return result;
    }
};

module.exports.Validator_user = Validator_user;

