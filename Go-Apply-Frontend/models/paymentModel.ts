export interface Payment {
  _id: string
  amount: number
  currency: string
  status: 'created' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  updatedAt: string
  description?: string
  paidAt?: string
  refund?: {
    amount: number
    reason: string
  }
}
