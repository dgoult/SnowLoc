export class ConfigurationService {
    public readonly apiEndpoint = this.getEnvProperty('API_ENDPOINT');

    public readonly apiCallTimeout = parseInt(this.getEnvProperty('API_TIMEOUT'), 10);

    public readonly version = this.getEnvProperty('VERSION');

    public readonly env = this.getEnvProperty('ENV');

    public readonly apiKey = this.getEnvProperty('API_KEY');

    private getEnvProperty(key: string): string {
        return (window.env && window.env[key]) || process.env[key] || process.env['VUE_APP_' + key] || '';
    }
}