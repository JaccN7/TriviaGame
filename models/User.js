class User {
    constructor(id, userEmail, userPassword, userName, userType, userStatus) {
        this.id = id;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userType = userType;
        this.userstatus = userStatus;
    }
}

module.exports = User;