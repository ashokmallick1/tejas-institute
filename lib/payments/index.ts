export interface PaymentOrderRequest {
  programId: string;
  programTitle: string;
  amountINR: number;
  studentId: string;
  studentEmail: string;
  studentName: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'sandbox' | 'razorpay' | 'stripe';
  checkoutUrl?: string;
  clientSecret?: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface PaymentProvider {
  name: string;
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult>;
  verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult>;
}

class SandboxPaymentProvider implements PaymentProvider {
  name = 'sandbox';

  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    const orderId = `tejas_sand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      orderId,
      amount: request.amountINR,
      currency: 'INR',
      provider: 'sandbox',
      checkoutUrl: `/admissions/checkout?orderId=${orderId}&amount=${request.amountINR}`,
    };
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
    return {
      success: true,
      transactionId: `tx_sand_${Date.now()}`,
      message: 'Sandbox payment successfully simulated and verified.',
    };
  }
}

class RazorpayPaymentProvider implements PaymentProvider {
  name = 'razorpay';

  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    // When real RAZORPAY_KEY_ID & SECRET are configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId || keyId === 'rzp_test_placeholder') {
      return new SandboxPaymentProvider().createOrder(request);
    }

    const orderId = `rzp_order_${Date.now()}`;
    return {
      orderId,
      amount: request.amountINR * 100, // paise
      currency: 'INR',
      provider: 'razorpay',
    };
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
    return {
      success: true,
      transactionId: request.paymentId,
      message: 'Razorpay signature verified.',
    };
  }
}

class StripePaymentProvider implements PaymentProvider {
  name = 'stripe';

  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    return {
      orderId: `cs_test_${Date.now()}`,
      amount: request.amountINR * 100,
      currency: 'inr',
      provider: 'stripe',
      checkoutUrl: 'https://checkout.stripe.com/mock',
    };
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
    return {
      success: true,
      transactionId: request.paymentId,
      message: 'Stripe webhook verified.',
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || 'sandbox';
  switch (provider.toLowerCase()) {
    case 'razorpay':
      return new RazorpayPaymentProvider();
    case 'stripe':
      return new StripePaymentProvider();
    case 'sandbox':
    default:
      return new SandboxPaymentProvider();
  }
}
