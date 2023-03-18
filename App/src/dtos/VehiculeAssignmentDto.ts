import { PeriodDto } from '@/dtos';

export class VehiculeAssignmentDto {
    constructor() {
        this.period = new PeriodDto();
    }

    public id?: number;

    public driverId?: number;

    public vehiculeId?: number;

    public driverName?: string;

    public vehiculeName?: string;

    public period?: PeriodDto;
}