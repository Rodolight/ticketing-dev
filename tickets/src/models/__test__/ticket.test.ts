import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123'
    });

  // Save de ticket to the database
     await ticket.save()
  // fetch the ticket twice
  const firtsInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
    firtsInstance!.set({price: 10});
    secondInstance!.set({price: 15});

  // Save the first fetched ticket
     await firtsInstance!.save();

  // Save the second fetched ticket  and expect an error
  try{
    await secondInstance!.save();
  }catch(err) {
    return;
  }

  throw new Error('Should not reach this point')
    
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 25,
    userId: '123'
  });

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
});