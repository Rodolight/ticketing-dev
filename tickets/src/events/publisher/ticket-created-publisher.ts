import { Publisher, Subjects, TicketCreatedEvent } from '@rdpticketsv/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}