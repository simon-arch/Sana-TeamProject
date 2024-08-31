export default interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role
    permissions: Permission[];
    state: UserStatus;
    workType: WorkType;
    workTime: number | null;
    approvedVacationsByUsers: string[];
    approveVacationsForUsers: string[];
}

export interface UserLite {
    username: string;
    firstName: string;
    lastName: string;
    role: Role
    state: UserStatus;
}

export enum Permission {
    ViewUsers = "VIEW_USERS",
    ManageUserRoles = "MANAGE_USER_ROLES",
    ManageUserPermissions = "MANAGE_USER_PERMISSIONS",
    RegisterUser = "REGISTER_USER",
    DeleteUser = "DELETE_USER",
    ApproveVacations = "APPROVE_VACATIONS",
    FireUser = "FIRE_USER",
    ManageUserWorkInfo = "MANAGE_USER_WORK_INFO",
    ViewStatistics = "VIEW_STATISTICS"
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

export enum Sort {
    FullName = "FULL_NAME",
    Role = "ROLE",
    State = "STATE",
}
