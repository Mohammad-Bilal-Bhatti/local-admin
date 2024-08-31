import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { IamService } from "./iam.service";
import { Response } from 'express';
import { AddToGroup, CreateAccessKeys, CreateGroupInput, CreatePolicyDto, CreateRoleDto, CreateUserInput, RemoveFromGroup } from "src/dtos/iam.dto";

@Controller('iam')
export class IamController {
    constructor(private readonly service: IamService) {}

    @Get()
    async getList(@Res() res: Response) {
        const users = await this.service.listUsers();
        const groups = await this.service.listGroups();
        const roles = await this.service.listRoles();
        const policies = await this.service.listPolicy();
        return res.render('iam-list', { Users: users.Users, Groups: groups.Groups, Roles: roles.Roles, Policies: policies.Policies });
    }

    @Get('create-user')
    async getCreateUser(@Res() res: Response) {
        return res.render('iam-create-user', {});
    }

    @Post('create-user')
    async createUser(@Res() res: Response, @Body() input: CreateUserInput) {
        const response = await this.service.createUser(input.username);
        return res.redirect(302, '/iam');
    }

    @Get('create-group')
    async getCreateGroup(@Res() res: Response) {
        return res.render('iam-create-group', {});
    }

    @Post('create-group')
    async createGroup(@Res() res: Response, @Body() input: CreateGroupInput) {
        const response = await this.service.createGroup(input.name);
        return res.redirect(302, '/iam');
    }

    @Get('user-details')
    async userDetails(@Res() res: Response, @Query('username') username: string, @Query('keyId') keyId: string, @Query('secret') secret: string) {
        const result = await this.service.getUser(username);
        const keys = await this.service.listAccessKeys(username);
        const groups = await this.service.listGroups();
        return res.render('iam-user-details', { username, details: result.User, Keys: keys.AccessKeyMetadata, keyId, secret, Groups: groups.Groups });
    }

    @Get('delete-user')
    async deleteUser(@Res() res: Response, @Query('username') username: string) {
        const result = await this.service.deleteUser(username);
        return res.redirect(302, '/iam');
    }

    @Get('delete-access-key')
    async deleteAccessKey(@Res() res: Response, @Query('accessKeyId') accessKeyId: string, @Query('username') username: string) {
        const result = await this.service.deleteAccessKey(accessKeyId);
        return res.redirect(302, `/iam/user-details?username=${username}`);
    }

    @Post('create-keys')
    async createAccessKeys(@Res() res: Response, @Body() input: CreateAccessKeys) {
        const result = await this.service.createAccessKeys(input.username);
        const keyId = result.AccessKey.AccessKeyId;
        const secret = result.AccessKey.SecretAccessKey;
        return res.redirect(302, `/iam/user-details?username=${input.username}&keyId=${keyId}&secret=${secret}`);
    }

    @Get('delete-group')
    async deleteGroup(@Res() res: Response, @Query('groupName') groupName: string) {
        const result = await this.service.deleteGroup(groupName);
        return res.redirect(302, '/iam');
    }

    @Get('group-details')
    async getGroupDetails(@Res() res: Response, @Query('groupName') groupName: string) {
        const group = await this.service.getGroup(groupName);
        return res.render('iam-group-details', { groupName, details: group.Group, Users: group.Users });
    }

    @Post('add-to-group')
    async addToGroup(@Res() res: Response, @Body() input: AddToGroup) {
        const result = await this.service.addToGroup(input.username, input.groupname);
        return res.redirect(302, `/iam/user-details?username=${input.username}`);
    }

    @Post('remove-from-group')
    async removeFromGroup(@Res() res: Response, @Body() input: RemoveFromGroup) {
        const result = await this.service.removeFromGroup(input.username, input.groupname);
        return res.redirect(302, `/iam/group-details?groupName=${input.groupname}`);
    }

    @Get('create-role')
    async getCreateRole(@Res() res: Response) {
        return res.render('iam-create-role', {});
    }

    @Post('create-role')
    async createRole(@Res() res: Response, @Body() input: CreateRoleDto) {
        const result = await this.service.createRole(input.name, input.description, input.policyDocument);
        return res.redirect(302, '/iam');
    }

    @Get('role-details')
    async getRoleDetails(@Res() res: Response, @Query('roleName') roleName: string) {
        const result = await this.service.getRole(roleName); 
        return res.render('iam-role-details', { roleName, Role: result.Role });
    }

    @Get('delete-role')
    async deleteRole(@Res() res: Response, @Query('roleName') roleName: string) {
        const result = await this.service.deleteRole(roleName); 
        return res.redirect(302, '/iam');
    }

    @Get('create-policy')
    async getCreatePolicy(@Res() res: Response) {
        return res.render('iam-create-policy', {});
    }

    @Post('create-policy')
    async createPolicy(@Res() res: Response, @Body() input: CreatePolicyDto) {
        const result = await this.service.createPolicy(input.name, input.description, input.policyDocument);
        return res.redirect(302, '/iam');
    }

    @Get('delete-policy')
    async deletePolicy(@Res() res: Response, @Query('arn') arn: string) {
        const result = await this.service.deletePolicy(arn);
        return res.redirect(302, '/iam');
    }

    @Get('policy-details')
    async getPolicyDetails(@Res() res: Response, @Query('arn') arn: string) {
        const result = await this.service.getPolicy(arn);
        return res.render('iam-policy-details', { arn, Policy: result.Policy });
    }

}