import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { IamService } from "./iam.service";
import { Response } from 'express';
import { AddToGroup, CreateAccessKeys, CreateGroupInput, CreatePolicyDto, CreateRoleDto, CreateUserInput, RemoveFromGroup } from "./iam.dto";

@Controller('iam')
export class IamController {
    constructor(private readonly service: IamService) {}

    @Get()
    @Render('iam-list')
    async getList() {
        const users = await this.service.listUsers();
        const groups = await this.service.listGroups();
        const roles = await this.service.listRoles();
        const policies = await this.service.listPolicy();
        return { Users: users.Users, Groups: groups.Groups, Roles: roles.Roles, Policies: policies.Policies };
    }

    @Get('create-user')
    @Render('iam-create-user')
    async getCreateUser() {
        return null;
    }

    @Post('create-user')
    @Redirect('/iam', 302)
    async createUser(@Body() input: CreateUserInput) {
        const response = await this.service.createUser(input.username);
        return null;
    }

    @Get('create-group')
    @Render('iam-create-group')
    async getCreateGroup() {
        return null;
    }

    @Post('create-group')
    @Redirect('/iam', 302)
    async createGroup(@Body() input: CreateGroupInput) {
        const response = await this.service.createGroup(input.name);
        return null;
    }

    @Get('user-details')
    @Render('iam-user-details')
    async userDetails(@Query('username') username: string, @Query('keyId') keyId: string, @Query('secret') secret: string) {
        const result = await this.service.getUser(username);
        const keys = await this.service.listAccessKeys(username);
        const groups = await this.service.listGroups();
        return { username, details: result.User, Keys: keys.AccessKeyMetadata, keyId, secret, Groups: groups.Groups };
    }

    @Get('delete-user')
    @Redirect('/iam', 302)
    async deleteUser(@Query('username') username: string) {
        const result = await this.service.deleteUser(username);
        return null;
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
    @Redirect('/iam', 302)
    async deleteGroup(@Query('groupName') groupName: string) {
        const result = await this.service.deleteGroup(groupName);
        return null;
    }

    @Get('group-details')
    @Render('iam-group-details')
    async getGroupDetails(@Query('groupName') groupName: string) {
        const group = await this.service.getGroup(groupName);
        return { groupName, details: group.Group, Users: group.Users };
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
    @Render('iam-create-role')
    async getCreateRole() {
        return null;
    }

    @Post('create-role')
    @Redirect('/iam', 302)
    async createRole(@Body() input: CreateRoleDto) {
        const result = await this.service.createRole(input.name, input.description, input.policyDocument);
        return null;
    }

    @Get('role-details')
    @Render('iam-role-details')
    async getRoleDetails(@Query('roleName') roleName: string) {
        const result = await this.service.getRole(roleName); 
        return { roleName, Role: result.Role };
    }

    @Get('delete-role')
    @Redirect('/iam', 302)
    async deleteRole(@Query('roleName') roleName: string) {
        const result = await this.service.deleteRole(roleName);
        return null;
    }

    @Get('create-policy')
    @Render('iam-create-policy')
    async getCreatePolicy() {
        return null;
    }

    @Post('create-policy')
    @Redirect('/iam', 302)
    async createPolicy(@Body() input: CreatePolicyDto) {
        const result = await this.service.createPolicy(input.name, input.description, input.policyDocument);
        return null;
    }

    @Get('delete-policy')
    @Redirect('/iam', 302)
    async deletePolicy(@Query('arn') arn: string) {
        const result = await this.service.deletePolicy(arn);
        return null;
    }

    @Get('policy-details')
    @Render('iam-policy-details')
    async getPolicyDetails(@Query('arn') arn: string) {
        const result = await this.service.getPolicy(arn);
        return { arn, Policy: result.Policy };
    }

}