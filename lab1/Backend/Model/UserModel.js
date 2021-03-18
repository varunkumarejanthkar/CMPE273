"use strict";

class UserModel
{
    constructor(username, password, email, userId, phoneNumber, lastLogin, currency, language)
    {
        this.username = username;
        this.password = password;
        this.email = email;
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.lastLogin = lastLogin;
        this.currency = currency;
        this.language = language;
    }
}

exports.UserModel = UserModel;