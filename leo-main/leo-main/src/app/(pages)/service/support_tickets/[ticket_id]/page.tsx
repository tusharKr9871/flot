'use client';

import TicketChat from '@/components/ticket-chat';
import TicketDetails from '@/components/ticket-details';

const Ticket = ({ params }: { params: { ticket_id: string } }) => {
  const { ticket_id } = params;

  return (
    <div className="md:px-14 mx-2 pt-4 pb-4">
      <TicketDetails ticketId={ticket_id} />
      <TicketChat ticketId={ticket_id} />
    </div>
  );
};

export default Ticket;
