import mongoose from 'mongoose';
import request  from 'supertest';
import { OrderStatus } from '@rdpticketsv/common';
import { app } from '../../app';
import { Order } from '../../models/order';

import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';
  
it('Returns a 404 when purchasing an order that does not exist', async() => {
  await request(app).post('/api/payments')
                    .set('Cookie', signin())
                    .send({
                     token: 'jhfkadnvdsds',
                     orderId: new mongoose.Types.ObjectId().toHexString()
                    })
                    .expect(404);
});
it('Returns a 401 when purchasing an order that doesnt belong to the user', async() => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();
  
  await request(app).post('/api/payments')
  .set('Cookie', signin())
  .send({
   token: 'jhfkadnvdsds',
   orderId: order.id
  })
  .expect(401);

});
it('Returns a 400 when purchasing a cancelled order', async() => {
   const userId = new mongoose.Types.ObjectId().toHexString();
   const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();
 
  await request(app).post('/api/payments')
                    .set('Cookie', signin(userId))
                    .send({
                      orderId: order.id,
                      token: 'jfhdhdfghdb'
                    })
                    .expect(400)
});

it('Returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
   id: new mongoose.Types.ObjectId().toHexString(),
   userId,
   version: 0,
   price,
   status: OrderStatus.Created
  });
  await order.save();

  await request(app).post('/api/payments')
                   .set('Cookie', signin(userId))
                   .send({
                     token: 'tok_visa',
                     orderId: order.id
                   })
                   .expect(201);
                
                   
  const stripeChages = await stripe.charges.list({ limit: 50});
  const stripeCharge = stripeChages.data.find(charge => {
    return charge.amount === price * 100
  }); 

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd'); 

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  
  expect(payment).not.toBeNull();
                    
  //const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.currency).toEqual('usd');

});