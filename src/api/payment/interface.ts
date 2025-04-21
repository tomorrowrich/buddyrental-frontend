export interface TransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  paymentId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseResponse {
  success: boolean;
  data: {
    clientSecret: string;
    transaction: TransactionResponse;
  };
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  REFUND = "REFUND",
}

export interface WithdrawCoinsResponse {
  success: boolean;
  data: {
    transaction: TransactionResponse;
  };
}
