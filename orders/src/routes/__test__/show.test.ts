import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';

it('fetch the order', async () => {
   // Create ticket
     const ticket =  Ticket.build({
       id: new mongoose.Types.ObjectId().toHexString(),
       title: 'concert',
       price: 25
     });

     await ticket.save();
     
     const user = signin();
   // Make a request to build an order with this ticket
     const {body: order } = await request(app).post('/api/orders')
                       .set('Cookie', user)
                       .send({ticketId: ticket.id})
                       .expect(201);
    
   // Make request to fetch the order
    const {body: fetchOrder } = await request(app).get(`/api/orders/${order.id}`)
                       .set('Cookie', user)
                       .send()
                       .expect(200); 

    expect(fetchOrder.id).toEqual(order.id);

});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create ticket
    const ticket =  Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 25
    });

    await ticket.save();
    
    const user = signin();
  // Make a request to build an order with this ticket
    const {body: order } = await request(app).post('/api/orders')
                      .set('Cookie', user)
                      .send({ticketId: ticket.id})
                      .expect(201);
   
  // Make request to fetch the order
   await request(app).get(`/api/orders/${order.id}`)
                      .set('Cookie', signin())
                      .send()
                      .expect(401); 



});