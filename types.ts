export interface PaymentData {
  amount: number;
  variableSymbol: string;
  message: string;
}

export interface ParsedPaymentResponse {
  amount: number;
  variableSymbol: string;
  message: string;
  confidence: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ERROR = 'ERROR',
}