import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from "@rdpticketsv/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../models/tickets';

const setup = async () => {
   // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
   // create a fake data event
    const data: TicketCreatedEvent['data'] = {
     version: 0,
     id: new mongoose.Types.ObjectId().toHexString(),
     title: 'concert',
     price: 50,
     userId: new mongoose.Types.ObjectId().toHexString(),
    };

   // create a fake message object
   // @ts-ignores
   const msg: Message = {
    ack: jest.fn()
   }
   return { listener, data, msg };
};

it('Create and saves an ticket', async () => {
   const { listener, data, msg } = await setup();
   // call the onMessage fucntion with the data object + message object
    await listener.onMessage(data, msg);

   // write assertioms to make sure a ticket was created
   const ticket = await Ticket.findById(data.id);
   
   expect(ticket).toBeDefined();
   expect(ticket!.title).toEqual(data.title);
   expect(ticket!.price).toEqual(data.price);

});

it('Acks the message', async () => { 
   const { listener, data, msg } = await setup();
   // call the onMessage fucntion with the data object + message object
   await listener.onMessage(data, msg);
   // write assertioms to make sure ack function is called
   expect(msg.ack).toHaveBeenCalled();
});