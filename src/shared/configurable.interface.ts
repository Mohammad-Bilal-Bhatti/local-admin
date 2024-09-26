import { ConfigureInput } from "src/app.dto";


export interface ConfigurableService {
    configure(configuration: ConfigureInput): void;
}
