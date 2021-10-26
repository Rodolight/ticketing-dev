import mongoose  from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@rdpticketsv/common';
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/tickets";

const setup = async () => {
  // Create a listener
     const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
     const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 30,
     });

     await ticket.save();

  // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
      id: ticket.id,
      version: ticket.version + 1,
      title: 'New concert',
      price: 345,
      userId: 'abacde',
    }
  // Create a fake msg object
       // @ts-ignores
    const msg: Message = {
    ack: jest.fn()
    };
  // return all of this stuff
  
   return { listener, ticket, data, msg };

};

it('finds, updates and saves a ticket', async () => {
 const { listener, data, ticket, msg } = await setup();

 await listener.onMessage(data, msg);

 const updatedTicket = await Ticket.findById(ticket.id);

 expect(updatedTicket!.title).toEqual(data.title);
 expect(updatedTicket!.price).toEqual(data.price);
 expect(updatedTicket!.version).toEqual(data.version);


});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
