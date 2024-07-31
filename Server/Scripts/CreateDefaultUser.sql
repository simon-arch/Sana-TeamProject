IF
NOT EXISTS(SELECT * FROM Users WHERE Username = 'Manager')
INSERT INTO Users
    (
        Username,
        PasswordHash,
        FirstName,
        LastName,
        Role,
        Permissions
    )
VALUES
    (
        @Username,
        @PasswordHash,
        @FirstName,
        @LastName,
        @Role,
        @Permissions
    );