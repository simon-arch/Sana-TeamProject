IF
NOT EXISTS(SELECT * FROM sys.tables WHERE name = 'Users')
CREATE TABLE Users
(
    Id           INT PRIMARY KEY IDENTITY,
    Username     NVARCHAR(MAX) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FirstName    NVARCHAR(MAX) NOT NULL,
    LastName     NVARCHAR(MAX) NOT NULL,
    Role         INT NOT NULL,
    Permissions  NVARCHAR(MAX) NOT NULL
);