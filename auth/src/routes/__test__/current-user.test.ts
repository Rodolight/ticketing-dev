import request from 'supertest';
import { app } from '../../app';
import { currentUser } from '@rdpticketsv/common';

it('responds with details about the current user', async() =>{
  const cookie = await signin();

  const response = await request(app)
                                 .get('/api/users/currentuser')
                                 .set("Cookie", cookie)
                                 .send()
                                 .expect(400);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if user is not authenticated', async () => {
  const response = await request(app)
                          .get('/api/users/currentuser')
                          .send()
                          .expect(200);

  expect(response.body.currentUser).toEqual(null);                        
          
});