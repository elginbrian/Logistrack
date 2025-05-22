export type SaleStatus = "completed" | "pending" | "canceled";

export interface ISale {
  _id?: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  date: Date;
  customer?: string;
  status: SaleStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
