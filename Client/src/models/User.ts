export default interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role
    permissions: Permission[];
    state: UserStatus;
    workType: WorkType;
    workingTime: number;
}

export enum Permission {
    ViewUsers = "VIEW_USERS",
    ManageUserRoles = "MANAGE_USER_ROLES",
    ManageUserPermissions = "MANAGE_USER_PERMISSIONS",
    RegisterUser = "REGISTER_USER",
    DeleteUser = "DELETE_USER",
    ReviewVacations = "REVIEW_VACATIONS",
    FireUser = "FIRE_USER"
}

export enum UserStatus {
    Available = "AVAILABLE",
    Vacation = "VACATION",
    Fired = "FIRED"
}

export enum WorkType {
    FullTime = "FULL_TIME",
    PartTime = "PART_TIME"
}

export enum Role {
    Developer = "DEVELOPER",
    UserManager = "USER_MANAGER",
}
