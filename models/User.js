class User {
    constructor(id, userEmail, userPassword, userName, userType, userStatus) {
        this.id = id;
        this.userName = userEmail;
        this.userPassword = userPassword;
        this.userType = userType;
        this.userstatus = userStatus;
    }
}

module.exports = User;