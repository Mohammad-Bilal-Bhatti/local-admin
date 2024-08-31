import { Module } from "@nestjs/common";
import { EventBridgeController } from "./event-bridge.controller";
import { EventBridgeService } from "./event-bridge.service";

@Module({
    imports: [],
    controllers: [ EventBridgeController ],
    providers: [ EventBridgeService ],
    exports: [ EventBridgeService ],
})
export class EventBridgeModule {

}
