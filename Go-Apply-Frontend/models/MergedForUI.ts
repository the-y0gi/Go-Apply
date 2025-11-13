import { Application } from "./application";
import { PaymentHistory } from "./PaymentHistory";
import { Payment } from "./paymentModel";

export interface MergedForUI {
  application: Application;
  payment?: Payment | PaymentHistory | null;
  uiStatus: "completed" | "pending" | "required" | "failed";
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: string;
}