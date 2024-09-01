
export class CreateUserInput {
    username: string;
}

export class CreateAccessKeys {
    username: string;
}

export class CreateGroupInput {
    name: string;
}

export class AddToGroup {
    username: string;
    groupname: string;
}

export class RemoveFromGroup {
    username: string;
    groupname: string;
}

export class CreateRoleDto {
    name: string;
    description: string;
    policyDocument: string;
}

export class CreatePolicyDto {
    name: string;
    description: string;
    policyDocument: string;
}