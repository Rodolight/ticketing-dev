import { Publisher,OrderCreatedEvent, Subjects } from '@rdpticketsv/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
