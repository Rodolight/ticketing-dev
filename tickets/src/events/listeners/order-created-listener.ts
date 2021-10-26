import { Message} from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@rdpticketsv/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
       const ticket = await Ticket.findById(data.ticket.id);
    // If not ticket, throw error
       if(!ticket){
         throw new Error('Ticket not found');
       }

    // Mark the ticket as being reserveed by setting its orderId property
     ticket.set({orderId: data.id });
    // Save the ticket
      await ticket.save();
    
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });

    // ack the message
       msg.ack();

  }
  
}