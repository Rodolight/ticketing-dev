import { Subjects, Publisher, PaymentCreatedEvent } from '@rdpticketsv/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}