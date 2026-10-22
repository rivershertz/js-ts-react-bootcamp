import { Alert, App, Button, Flex, Spin, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssignees, useSaveTicket, useTicket, useTickets, type TicketInput } from '../api/tickets';
import TicketForm, { NEW_TICKET, toFormValues } from '../components/TicketForm';

// /tickets/new and /tickets/:id. React keeps this same component when the URL moves between them,
// so every hook is called on every render, before any early return.
export default function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: tickets = [] } = useTickets();
  const { data: assignees = [] } = useAssignees();
  const { data: ticket, isPending, isError } = useTicket(id);
  const save = useSaveTicket();

  async function onSave(input: TicketInput) {
    const saved = await save.mutateAsync({ id, input });
    if (id) {
      message.success('Saved');
      navigate('/tickets');
    } else {
      message.success('Ticket created. You can keep editing it here.');
      navigate(`/tickets/${saved.id}`, { replace: true });
    }
  }

  const index = tickets.findIndex((t) => t.id === id);
  const previous = index > 0 ? tickets[index - 1] : undefined;
  const next = index >= 0 && index < tickets.length - 1 ? tickets[index + 1] : undefined;

  let body;
  if (id && isPending) body = <Spin />;
  else if (id && (isError || !ticket)) body = <Alert type="error" message={`Could not load ticket ${id}`} />;
  else {
    body = (
      // key: a different ticket gets a fresh form, so its initialValues are read again.
      <TicketForm
        key={id ?? 'new'}
        initialValues={ticket ? toFormValues(ticket) : NEW_TICKET}
        assignees={assignees}
        saving={save.isPending}
        submitLabel={id ? 'Save' : 'Create ticket'}
        onSave={onSave}
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap gap={8}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {id ? `Edit ticket ${id}` : 'New ticket'}
        </Typography.Title>
        <Flex gap={8}>
          <Button onClick={() => navigate('/tickets')}>Back to list</Button>
          {id && (
            <>
              <Button disabled={!previous} onClick={() => previous && navigate(`/tickets/${previous.id}`)}>
                Previous
              </Button>
              <Button disabled={!next} onClick={() => next && navigate(`/tickets/${next.id}`)}>
                Next
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      {body}
    </Flex>
  );
}
