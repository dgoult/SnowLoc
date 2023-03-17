import { VehiculeRegistrationDto } from '@/dtos';

export class VehiculeDto {
    constructor() {
        this.registration = new VehiculeRegistrationDto();
    }

    public id?: number;

    public brand?: string;

    public model?: string;

    public category?: string;

    public registration?: VehiculeRegistrationDto;
}