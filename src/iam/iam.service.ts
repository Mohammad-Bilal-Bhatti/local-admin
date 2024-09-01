import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    IAMClient,
    CreateUserCommand, 
    CreateUserCommandOutput,
    ListUsersCommand,
    ListUsersCommandOutput,
    DeleteUserCommand,
    DeleteUserCommandOutput,
    GetUserCommand,
    GetUserCommandOutput,
    CreateAccessKeyCommand,
    ListAccessKeysCommand,
    ListAccessKeysCommandOutput,
    DeleteAccessKeyCommand,
    CreateGroupCommand,
    CreateGroupCommandOutput,
    AddUserToGroupCommand,
    AddUserToGroupCommandOutput,
    ListGroupsCommand,
    ListGroupsCommandOutput,
    DeleteGroupCommand,
    DeleteGroupCommandOutput,
    GetGroupCommand,
    GetGroupCommandOutput,
    RemoveUserFromGroupCommand,
    CreateRoleCommand,
    CreateRoleCommandOutput,
    ListRolesCommand,
    ListRolesCommandOutput,
    GetRoleCommand,
    GetRoleCommandOutput,
    DeleteRoleCommand,
    DeleteRoleCommandOutput,
    CreatePolicyCommand,
    CreatePolicyCommandOutput,
    DeletePolicyCommand,
    DeletePolicyCommandOutput,
    ListPoliciesCommand,
    ListPoliciesCommandOutput,
    GetPolicyCommand,
    GetPolicyCommandOutput,
} from "@aws-sdk/client-iam";

@Injectable()
export class IamService {

    private readonly client: IAMClient;
    constructor(private readonly config: ConfigService) {
        this.client = new IAMClient({
            endpoint: this.config.get<string>('localstack.endpoint'),
            region: this.config.get<string>('localstack.region'),
        });
    }

    async createUser(username: string): Promise<CreateUserCommandOutput> {
        const command = new CreateUserCommand({
            UserName: username, 
        });
        const response = await this.client.send(command);
        return response;
    }

    async listUsers(): Promise<ListUsersCommandOutput> {
        const command = new ListUsersCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async deleteUser(username: string): Promise<DeleteUserCommandOutput> {
        const command = new DeleteUserCommand({ UserName: username });
        const response = this.client.send(command);
        return response;
    }

    async getUser(username: string): Promise<GetUserCommandOutput> {
        const command = new GetUserCommand({ UserName: username });
        const response = await this.client.send(command);
        return response;
    }

    async createAccessKeys(username: string) {
        const command = new CreateAccessKeyCommand({ UserName: username });
        const resonse = await this.client.send(command);
        return resonse;
    }

    async listAccessKeys(username: string): Promise<ListAccessKeysCommandOutput> {
        const command = new ListAccessKeysCommand({ UserName: username });
        const response = await this.client.send(command);
        return response;
    }

    async deleteAccessKey(accessKeyId: string) {
        const command = new DeleteAccessKeyCommand({ AccessKeyId: accessKeyId });
        const response = await this.client.send(command);
        return response;
    }

    async createGroup(groupName: string): Promise<CreateGroupCommandOutput> {
        const command = new CreateGroupCommand({ GroupName: groupName });
        const response = await this.client.send(command);
        return response;
    }

    async addUserToGroup(userName: string, groupName: string): Promise<AddUserToGroupCommandOutput> {
        const command = new AddUserToGroupCommand({ GroupName: groupName, UserName: userName });
        const response = await this.client.send(command);
        return response;
    }
    
    async listGroups(): Promise<ListGroupsCommandOutput> {
        const command = new ListGroupsCommand();
        const response = await this.client.send(command);
        return response;
    }

    async deleteGroup(name: string): Promise<DeleteGroupCommandOutput> {
        const command = new DeleteGroupCommand({ GroupName: name });
        const response = await this.client.send(command);
        return response;
    }

    async getGroup(name: string): Promise<GetGroupCommandOutput> {
        const command = new GetGroupCommand({ GroupName: name });
        const response = await this.client.send(command);
        return response;
    }

    async addToGroup(username: string, groupname: string) {
        const command = new AddUserToGroupCommand({ UserName: username, GroupName: groupname });
        const response = await this.client.send(command);
        return response;
    }

    async removeFromGroup(username: string, groupname: string) {
        const command = new RemoveUserFromGroupCommand({ UserName: username, GroupName: groupname });
        const response = await this.client.send(command);
        return response;
    }

    async createRole(name: string, description: string, policyDocument: string): Promise<CreateRoleCommandOutput> {
        const command = new CreateRoleCommand({ RoleName: name, Description: description, AssumeRolePolicyDocument: policyDocument });
        const response = await this.client.send(command);
        return response;
    }

    async listRoles(): Promise<ListRolesCommandOutput> {
        const command = new ListRolesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async getRole(name: string): Promise<GetRoleCommandOutput> {
        const command = new GetRoleCommand({ RoleName: name });
        const response = await this.client.send(command);
        return response;
    }

    async deleteRole(name: string): Promise<DeleteRoleCommandOutput> {
        const command = new DeleteRoleCommand({ RoleName: name });
        const response = await this.client.send(command);
        return response;
    }

    async createPolicy(name: string, description: string, policyDocument: string): Promise<CreatePolicyCommandOutput> {
        const command = new CreatePolicyCommand({ PolicyName: name, Description: description, PolicyDocument: policyDocument });
        const response = await this.client.send(command);
        return response;
    }

    async deletePolicy(arn: string): Promise<DeletePolicyCommandOutput> {
        const command = new DeletePolicyCommand({ PolicyArn: arn });
        const response = await this.client.send(command);
        return response;
    }

    async listPolicy(): Promise<ListPoliciesCommandOutput> {
        const command = new ListPoliciesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async getPolicy(arn: string): Promise<GetPolicyCommandOutput> {
        const command = new GetPolicyCommand({ PolicyArn: arn });
        const response = await this.client.send(command);
        return response;
    }

}