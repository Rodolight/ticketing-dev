import { Publisher, Subjects, TicketUpdatedEvent } from '@rdpticketsv/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}