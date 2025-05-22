export interface IProduct {
  _id?: string;
  name: string;
  stock: number;
  unit: string;
  category: string;
  lastUpdated: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
