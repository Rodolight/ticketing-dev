import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@rdpticketsv/common';
import { Ticket } from '../../models/tickets';
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
   
    const ticket = await Ticket.findByEvent(data);

     if(!ticket) {
       throw new Error('Ticket not found.')
     }
     
     const { title, price } = data; // , version 
     ticket.set({title, price }); //, version  when not use pluging must add this
     await ticket.save();

     msg.ack();
     
  }

}

