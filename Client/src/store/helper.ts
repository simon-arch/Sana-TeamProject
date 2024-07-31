export const normalizeEnumValues = (input: string): string => {
    return input
        .toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^./, (str) => str.toUpperCase());
};

export enum Role {
    Developer = 'Developer',
    UserManager = 'UserManager',
}

export enum Permission {
    ViewUsers = 'VIEW_USERS',
    ManageUserRoles = 'ManageUserRoles',
    ManageUserPermissions = 'ManageUserPermissions',
    CreateUsers = 'CreateUsers',
    UpdateUsers = 'UpdateUsers',
    DeleteUsers = 'DeleteUsers'
}