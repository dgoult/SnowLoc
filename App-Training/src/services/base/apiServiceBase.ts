import { Wretcher } from 'wretch/dist/wretcher';
import { AuthDto } from '@/dtos';
import { ApiCallError } from '@/errors';
import { ProblemDetails } from '@/models';
import { parseISO } from 'date-fns';
import { plainToClass, ClassConstructor } from 'class-transformer';
import camelcaseKeys from 'camelcase-keys';
import { DialogLevel } from '@/enums';
import { LogService, LocalStorageService, DialogService } from '@/services';
import { ConfiguredMiddleware, FetchLike, WretcherOptions, WretcherResponse } from 'wretch';

export abstract class ApiServiceBase {
    protected logService: LogService;

    protected apiEndpoint: string;

    protected apiKey: string;

    protected apiCallTimeout: number;

    protected dialogService: DialogService;

    private storageService: LocalStorageService;

    protected constructor(logService: LogService, storageService: LocalStorageService, dialogService: DialogService, apiEndpoint: string, apiCallTimeout: number, apiKey: string) {
        this.logService = logService.forContext('ApiServiceBase');
        this.apiEndpoint = apiEndpoint;
        this.apiKey = apiKey;
        this.apiCallTimeout = apiCallTimeout;
        this.storageService = storageService;
        this.dialogService = dialogService;
    }

    protected getDefaultHeaders(): { [headerName: string]: string } {
        return {
            'Accept-Encoding': 'gzip,deflate,br'
        };
    }

    protected async createClient(baseEndpoint: string): Promise<Wretcher> {
        let callChain: Wretcher = Wretcher
            .factory()
            .url(baseEndpoint)
            .headers(this.getDefaultHeaders())
            .resolve(resolver => resolver
                .setTimeout(this.apiCallTimeout * 1000)
                .onAbort(_ => {
                    throw new ApiCallError('Délai d\'attente du serveur dépassée.');
                }))
            .middlewares([this.noContentMiddleware])
            .catcher(400, err => {
                let problemDetails: ProblemDetails | null = null;

                if (this.isValidJson(err.message)) {
                    problemDetails = this.toClass<ProblemDetails>(JSON.parse(err.message) as Record<string, unknown>, ProblemDetails);
                }

                if (problemDetails) {
                    throw new ApiCallError(`Données envoyées invalides.\n${problemDetails.title}\n${problemDetails.detail || ''}`);
                } else {
                    throw new ApiCallError(`Données envoyées invalides.\n${err.message}`);
                }
            })
            .catcher(401, () => {
                this.clearToken();
            })
            .catcher(408, () => {
                throw new ApiCallError('Délai d\'attente du serveur dépassée.');
            })
            .catcher(500, () => {
                throw new ApiCallError('Erreur interne du serveur.');
            });

        const jwtToken: AuthDto = await this.getToken();

        if (jwtToken) {
            callChain = callChain.auth(`Bearer ${jwtToken.token}`);
        }

        return callChain;
    }

    protected async storeToken(jwtToken: AuthDto): Promise<void> {
        await this.storageService.set<AuthDto>('jwtToken', jwtToken);
    }

    protected async clearToken(): Promise<void> {
        await this.storageService.set<AuthDto>('jwtToken', null);
    }

    protected async apiCall<TResult>(call: (wretcher: Wretcher) => Promise<TResult>, isErrorManaged = false): Promise<TResult | null> {
        try {
            return await call(await this.createClient(this.apiEndpoint));
        } catch (err: unknown) {
            let errorMessage: string = '';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            if (!isErrorManaged) {
                let problemDetails: ProblemDetails | null = null;

                if (this.isValidJson(errorMessage)) {
                    problemDetails = this.toClass<ProblemDetails>(JSON.parse(errorMessage) as Record<string, unknown>, ProblemDetails);
                }

                this.dialogService.toast((problemDetails && problemDetails.detail) || errorMessage, DialogLevel.Error, 'Erreur serveur');
            } else {
                throw err;
            }

            this.logService.error(errorMessage, 'Api call failed');
        }

        return null;
    }

    protected async getAuthToken(): Promise<AuthDto> {
        let fetchError: boolean = false;

        const response: Record<string, unknown> | null = await Wretcher
            .factory()
            .url(`${this.apiEndpoint}/auth/token`)
            .content('application/json')
            .body(JSON.stringify(this.apiKey))
            .post()
            .fetchError(_ => {
                fetchError = true;

                throw new ApiCallError('Serveur injoignable.');
            })
            .json()
            .catch(err => {
                if (fetchError) {
                    throw err;
                }

                throw new ApiCallError('Authentification invalide.');
            });

        return this.toClass<AuthDto>(response, AuthDto) as AuthDto;
    }

    protected async getToken(): Promise<AuthDto> {
        let jwtToken: AuthDto | null = await this.storageService.get<AuthDto>('jwtToken');

        if (!jwtToken || !jwtToken.expiredDate || parseISO(jwtToken.expiredDate).getTime() < new Date().getTime()) {
            jwtToken = await this.getAuthToken();

            this.storeToken(jwtToken);
        }

        return jwtToken;
    }

    protected toClass<T>(records: Record<string, unknown>[] | null, type: ClassConstructor<T>): T[] | null;

    protected toClass<T>(record: Record<string, unknown> | null, type: ClassConstructor<T>): T | null;

    protected toClass<T>(records: Record<string, unknown> | Record<string, unknown>[] | null, type: ClassConstructor<T>): T | T[] | null {
        return records !== null
            ? plainToClass(type, camelcaseKeys(records, { deep: true })) as T | T[]
            : null;
    }

    private isValidJson(input: string): boolean {
        try {
            const o = JSON.parse(input);

            if (o && o.constructor === Object) {
                return o;
            }
        } catch {
            return false;
        }

        return true;
    }

    protected noContentMiddleware: ConfiguredMiddleware = (next: FetchLike) => async(url: string, opts: WretcherOptions): Promise<WretcherResponse> => {
        const response = await next(url, opts);
        if (response.status === 204) {
            response.json = () => Promise.resolve(null);
        }
        return response;
    };
}