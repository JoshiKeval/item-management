export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export type User = {
  id: string;
  status: string;
};

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
