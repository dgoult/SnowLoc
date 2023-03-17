import { LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { ApiServiceBase } from '@/services/base/apiServiceBase';
import { AuthDto, DriverDto, VehiculeDto, VehiculeAssignmentDto } from '@/dtos';
import { WretcherResponse } from 'wretch';

export class ApiService extends ApiServiceBase {
    public constructor(logService: LogService, storageService: LocalStorageService, dialogService: DialogService, configurationService: ConfigurationService) {
        super(logService, storageService, dialogService, configurationService.apiEndpoint, configurationService.apiCallTimeout, configurationService.apiKey);
    }

    // #region "Driver"

    public async getDrivers(): Promise<DriverDto[] | null> {
        const response: Record<string, unknown>[] | null = await this.apiCall(async client => await client
            .url('/driver')
            .get()
            .json());

        return this.toClass<DriverDto>(response, DriverDto);
    }

    public async getDriver(driverId: number | undefined): Promise<DriverDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/driver/${driverId}`)
            .get()
            .json());

        return this.toClass<DriverDto>(response, DriverDto);
    }

    public async createDriver(driver: DriverDto): Promise<DriverDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url('/driver')
            .json(driver)
            .post()
            .json());
        if (response) {
            return this.toClass<DriverDto>(response, DriverDto);
        }
        return null;
    }

    public async updateDriver(driver: DriverDto): Promise<DriverDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url('/driver')
            .json(driver)
            .put()
            .json());

        if (response) {
            return this.toClass<DriverDto>(response, DriverDto);
        }
        return null;
    }

    public async deleteDriver(driverId: number): Promise<boolean> {
        const response: WretcherResponse | null = await this.apiCall(async client => await client
            .url(`/driver/${driverId}`)
            .delete()
            .res());

        return response
            ? response.ok
            : false;
    }

    // #endregion "Driver"

    // #regin "Vehicule"
    public async getVehicules(): Promise<VehiculeDto[] | null> {
        const response: Record<string, unknown>[] | null = await this.apiCall(async client => await client
            .url('/vehicule')
            .get()
            .json());

        return this.toClass<VehiculeDto>(response, VehiculeDto);
    }

    public async getVehicule(vehiculeId: number): Promise<VehiculeDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/vehicule/${vehiculeId}`)
            .get()
            .json());

        return this.toClass<VehiculeDto>(response, VehiculeDto);
    }

    public async createVehicule(vehicule: VehiculeDto): Promise<VehiculeDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url('/vehicule')
            .json(vehicule)
            .post()
            .json());
        if (response) {
            return this.toClass<VehiculeDto>(response, VehiculeDto);
        }
        return null;
    }

    public async updateVehicule(vehicule: VehiculeDto): Promise<VehiculeDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url('/vehicule')
            .json(vehicule)
            .put()
            .json());
        if (response) {
            return this.toClass<VehiculeDto>(response, VehiculeDto);
        }
        return null;
    }

    public async deleteVehicule(vehiculeId: number): Promise<boolean> {
        const response: WretcherResponse | null = await this.apiCall(async client => await client
            .url(`/vehicule/${vehiculeId}`)
            .delete()
            .res());

        return response
            ? response.ok
            : false;
    }

    // #endregion "Vehicule"

    // #regin "VehiculeAssignment"
    public async getVehiculeAssignments(): Promise<VehiculeAssignmentDto[] | null> {
        const response: Record<string, unknown>[] | null = await this.apiCall(async client => await client
            .url('/vehiculeAssignment')
            .get()
            .json());

        return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
    }

    public async getVehiculeAssignment(vehiculeAssignmentId: number): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/vehiculeAssignment/${vehiculeAssignmentId}`)
            .get()
            .json());

        return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
    }

    public async getVehiculeAssignmentByDriverId(driverId: number): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/driver/${driverId}/assignment/vehicule`)
            .get()
            .json());

        return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
    }

    public async getVehiculeAssignmentByVehiculeId(vehiculeId: number): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/vehicule/${vehiculeId}/assignment/driver`)
            .get()
            .json());

        return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
    }

    public async createVehiculeAssignmentByDriver(vehicule: VehiculeAssignmentDto): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/driver/${vehicule.driverId}/assignment/vehicule`)
            .json(vehicule)
            .post()
            .json());
        if (response) {
            return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
        }
        return null;
    }

    public async createVehiculeAssignmentByVehicule(vehicule: VehiculeAssignmentDto): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/vehicule/${vehicule.vehiculeId}/assignment/driver`)
            .json(vehicule)
            .post()
            .json());
        if (response) {
            return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
        }
        return null;
    }

    public async updateVehiculeAssignment(vehicule: VehiculeAssignmentDto): Promise<VehiculeAssignmentDto | null> {
        const response: Record<string, unknown> | null = await this.apiCall(async client => await client
            .url(`/vehicule/${vehicule.vehiculeId}/assignment/driver`)
            .json(vehicule)
            .put()
            .json());
        if (response) {
            return this.toClass<VehiculeAssignmentDto>(response, VehiculeAssignmentDto);
        }
        return null;
    }

    // #endregion "Vehicule"

    public async getAuth(): Promise<AuthDto | null> {
        return await super.getToken();
    }
}