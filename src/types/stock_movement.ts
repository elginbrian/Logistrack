export type MovementType = "in" | "out";

export interface IStockMovement {
  _id?: string;
  product: string;
  user?: string;
  type: MovementType;
  quantity: number;
  note?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
