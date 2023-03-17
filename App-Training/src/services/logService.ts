/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerConfiguration, ConsoleSink, Logger } from 'serilogger';
import { cloneDeep } from 'lodash';

export class LogService {
    private logger: Logger;

    private context: string = '';

    public constructor() {
        this.logger = this.createLogger();
    }

    public forContext(context: string): LogService {
        const contextualizedLogger = cloneDeep<LogService>(this);

        contextualizedLogger.context = context;

        return contextualizedLogger;
    }

    public verbose(template: string, ...values: any[]): void {
        this.logger.verbose(this.enrichTemplate(template), values);
    }

    public debug(template: string, ...values: any[]): void {
        this.logger.debug(this.enrichTemplate(template), values);
    }

    public information(template: string, ...values: any[]): void {
        this.logger.info(this.enrichTemplate(template), values);
    }

    public warning(template: string, ...values: any[]): void;

    public warning(error: Error, template: string, ...values: any[]): void

    public warning(errorOrMessageTemplate: Error | string, ...values: any[]): void {
        if (errorOrMessageTemplate instanceof Error) {
            this.logger.warn(errorOrMessageTemplate, this.enrichTemplate(values[0]), values.slice(1));
        } else {
            this.logger.warn(this.enrichTemplate(errorOrMessageTemplate), values);
        }
    }

    public error(template: string, ...values: any[]): void;

    public error(error: Error, template: string, ...values: any[]): void;

    public error(errorOrMessageTemplate: Error | string, ...values: any[]): void {
        if (errorOrMessageTemplate instanceof Error) {
            this.logger.error(errorOrMessageTemplate, this.enrichTemplate(values[0]), values.slice(1));
        } else {
            this.logger.error(this.enrichTemplate(errorOrMessageTemplate), values);
        }
    }

    public fatal(template: string, ...values: any[]): void;

    public fatal(error: Error, template: string, ...values: any[]): void;

    public fatal(errorOrMessageTemplate: Error | string, ...values: any[]): void {
        if (errorOrMessageTemplate instanceof Error) {
            this.logger.fatal(errorOrMessageTemplate, this.enrichTemplate(values[0]), values.slice(1));
        } else {
            this.logger.fatal(this.enrichTemplate(errorOrMessageTemplate), values);
        }
    }

    private enrichTemplate(template: string): string {
        return this.context !== ''
            ? `${this.context} - ${template}`
            : template;
    }

    private createLogger(): Logger {
        const logConfiguration = new LoggerConfiguration()
            .enrich(() => ({ context: this.context }))
            .minLevel.debug()
            .writeTo(new ConsoleSink());

        const logger: Logger = logConfiguration.create();

        logger.setJSONTemplateStringMaxLength(-1);

        return logger;
    }
}