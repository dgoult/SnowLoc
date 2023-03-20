import type {TransactionDto} from '@/dtos';

export class ProductDto {
  public id?: number;

  public libelle?: string;

  public reference?: string;

  public category?: string;

  public storageAmount?: number;

  public transactions?: TransactionDto[] = [];
}
