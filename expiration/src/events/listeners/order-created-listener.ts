import { Listener, OrderCreatedEvent, Subjects } from '@rdpticketsv/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queue/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
 queueGroupName = queueGroupName;
 readonly subject = Subjects.OrderCreated;

 async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
   const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
   console.log('Wiating this many seconds to process the job: ', delay);

   await expirationQueue.add(
    { orderId: data.id, },
    {delay, }
   );

   msg.ack();
 }

}