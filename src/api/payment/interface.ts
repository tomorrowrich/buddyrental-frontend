export interface TransactionResponse {
  id: string;
  userId: string;
  type: string;
  amount: number;
  paymentId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseResponse {
  success: boolean;
  data: {
    url: string;
    transaction: TransactionResponse;
  };
}

// export interface WithdrawCoinsResponse {
//   success: boolean;
//   transaction: TransactionResponse;
// }
