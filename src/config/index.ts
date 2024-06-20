import applicationConfig,{configType} from './application';

class AppConfig {
    private static _instance: AppConfig;

    private static configs: { [key: string]: string } = {
        //... application configurations
    };

    private constructor() {}

    private static getInstance() : AppConfig{
        if (!this._instance) {
            this._instance = new AppConfig();
        }
        return this._instance;
    }

    static register(configs : { [key: string]: string | undefined}) : AppConfig{

        this.getInstance();

        Object.entries(configs).map(([key, value]) => {
            if(!value){
                throw new Error(`value of ${key} cannot be null`)
            }
            this.configs[key] = value;
        })

        return this;
    }

    static getConfig(key: configType): string {
        if (key === undefined || !(key in this.configs)) {
            throw new Error(`Invalid config key: ${key}`);
        }
        return this.configs[key as keyof typeof this.configs];
    }
}

//register configuration
AppConfig.register({
    ...applicationConfig,
})

export default AppConfig;

