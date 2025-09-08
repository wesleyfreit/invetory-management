export interface SenderProps {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, unknown>;
}

export abstract class Sender {
  abstract sendNotification(props: SenderProps): Promise<void>;
}
