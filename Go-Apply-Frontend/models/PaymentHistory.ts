export interface PaymentHistory {
  _id: string;
  applicationId?: string;
  userId?: string;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: "created" | "paid" | "failed" | "refunded";
  amountPaid: number;
  currency: string;
  paymentDate: string;
  gatewayResponse?: any;
  description?: string;
  universityName?: string;
  programName?: string;
  receiptAvailable?: boolean;
}
