import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@rdpticketsv/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/orders';
import { Ticket } from '../../../models/tickets';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new  mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'abcdef',
    expiresAt: new Date(),
    ticket,
  });
  
  await order.save();
  
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };

};

it('Updates the order status to cancelled', async() => {
  const  { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg );

  const updateOrder = await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('Emit an OrderCancelled event', async() => {
  const  { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg );
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);

});

it('Ack the message', async() => {
  const  { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg );

  expect(msg.ack).toHaveBeenCalled();

});