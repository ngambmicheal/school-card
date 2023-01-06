export enum UserType {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT', 
    STAFF =   'STAFF',
    PARENT = 'PARENT',
}

export enum UserRole{
    ADMIN = 'ADMIN', 
    STAFF = 'STAFF', 
    TEACHER = 'TEACHER'
}

export enum HeadersEnum{
    SchoolId= 'schoolid'
}

export const UserTypeCode: Record<UserType, string> =  {
 [UserType.ADMIN] : 'ADM', 
 [UserType.STUDENT] : 'STD', 
 [UserType.STAFF] : 'STF',
 [UserType.PARENT]: 'PRT'
}