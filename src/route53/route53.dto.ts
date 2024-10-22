import { ChangeAction, RRType } from "@aws-sdk/client-route-53";

export class CreateHostedZoneDto {
    name: string;
    callerReference: string;
}

export class ChangeRecordSetDto {
    hostedZoneId: string;
    action: ChangeAction;
    recordName: string;
    recordType: RRType;
    recordValue: string;
}

export { ChangeAction, RRType } from "@aws-sdk/client-route-53";
