import { Alert, App, Button, Flex, Form, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssignees, useSaveTicket, useTicket, useTickets } from '../api/tickets';
import TicketForm, { toFormValues } from '../components/TicketForm';

// /tickets/new and /tickets/:id
export default function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { data: tickets = [] } = useTickets();
  const { data: assignees = [] } = useAssignees();
  const save = useSaveTicket();

  async function onSave(input) {
    const saved = await save.mutateAsync({ id, input });
    if (id) {
      message.success('Saved');
      navigate('/tickets');
    } else {
      message.success('Ticket created. You can keep editing it here.');
      navigate(`/tickets/${saved.id}`, { replace: true });
    }
  }

  if (!id) {
    return (
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            New ticket
          </Typography.Title>
          <Button onClick={() => navigate('/tickets')}>Back to list</Button>
        </Flex>
        <TicketForm form={form} assignees={assignees} saving={save.isPending} submitLabel="Create ticket" onSave={onSave} />
      </Flex>
    );
  }

  const { data: ticket, isPending, isError } = useTicket(id);

  // Fill the form in with the ticket.
  useEffect(() => {
    if (ticket) form.setFieldsValue(toFormValues(ticket));
  }, []);

  const index = tickets.findIndex((t) => t.id === id);
  const previous = tickets[index - 1];
  const next = tickets[index + 1];

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap gap={8}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Edit ticket {id}
        </Typography.Title>
        <Flex gap={8}>
          <Button onClick={() => navigate('/tickets')}>Back to list</Button>
          <Button disabled={!previous} onClick={() => navigate(`/tickets/${previous.id}`)}>
            Previous
          </Button>
          <Button disabled={!next} onClick={() => navigate(`/tickets/${next.id}`)}>
            Next
          </Button>
        </Flex>
      </Flex>
      {isPending && <Spin />}
      {isError && <Alert type="error" message={`Could not load ticket ${id}`} />}
      {ticket && <TicketForm form={form} assignees={assignees} saving={save.isPending} submitLabel="Save" onSave={onSave} />}
    </Flex>
  );
}
