export const normalizeEnumValues = (input: string): string => {
    return input
        .toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^./, (str) => str.toUpperCase());
};

export const hasPermission = (permissions: string[], ...requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
};

