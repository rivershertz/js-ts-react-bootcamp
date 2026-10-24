import { App, Button, Flex, Form, Input, Select } from 'antd';
import { PRIORITIES, STATUSES, type Assignee, type Priority, type Status, type Ticket } from '@tickets/logic';
import axios from 'axios';
import type { TicketInput } from '../api/tickets';

export type TicketFormValues = {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  assignee?: string;
  blockedReason?: string;
  dueDate?: string;
};

export const NEW_TICKET: TicketFormValues = { title: '', priority: 'medium', status: 'open' };

export function toFormValues(ticket: Ticket): TicketFormValues {
  return {
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignee: 'assignee' in ticket ? ticket.assignee : undefined,
    blockedReason: ticket.status === 'blocked' ? ticket.blockedReason : undefined,
    dueDate: ticket.dueDate ?? undefined,
  };
}

function toInput(values: TicketFormValues): TicketInput {
  return {
    title: values.title.trim(),
    description: values.description ?? '',
    priority: values.priority,
    status: values.status,
    dueDate: values.dueDate || null,
    assignee: values.status === 'open' ? undefined : values.assignee,
    blockedReason: values.status === 'blocked' ? values.blockedReason : undefined,
  };
}

const FIELDS: readonly (keyof TicketFormValues)[] = ['title', 'description', 'priority', 'status', 'assignee', 'blockedReason', 'dueDate'];

function isField(value: unknown): value is keyof TicketFormValues {
  return FIELDS.some((field) => field === value);
}

// The Python API answers 400 with { errors: [{ field, message }] }.
function serverFieldErrors(error: unknown): { name: keyof TicketFormValues; errors: string[] }[] {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return [];
  const body: unknown = error.response.data;
  if (typeof body !== 'object' || body === null || !('errors' in body) || !Array.isArray(body.errors)) return [];
  return body.errors.flatMap((e: unknown) =>
    typeof e === 'object' && e !== null && 'field' in e && 'message' in e && isField(e.field) && typeof e.message === 'string'
      ? [{ name: e.field, errors: [e.message] }]
      : [],
  );
}

type Props = {
  initialValues: TicketFormValues;
  assignees: Assignee[];
  saving: boolean;
  submitLabel: string;
  onSave: (input: TicketInput) => Promise<unknown>;
};

// Mount it with a key per ticket: initialValues are only read on the first render.
export default function TicketForm({ initialValues, assignees, saving, submitLabel, onSave }: Props) {
  const [form] = Form.useForm<TicketFormValues>();
  const { message } = App.useApp();
  const status = Form.useWatch('status', form) ?? initialValues.status;

  async function finish(values: TicketFormValues) {
    try {
      await onSave(toInput(values));
    } catch (error) {
      const fields = serverFieldErrors(error);
      if (fields.length > 0) form.setFields(fields);
      else message.error(error instanceof Error ? error.message : 'Could not save the ticket');
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={finish} style={{ maxWidth: 560 }}>
      <Form.Item label="Title" name="title" rules={[{ required: true, whitespace: true, message: 'Title is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Flex gap={16}>
        <Form.Item label="Priority" name="priority" rules={[{ required: true }]} style={{ flex: 1 }}>
          <Select options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true }]} style={{ flex: 1 }}>
          <Select options={STATUSES.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
      </Flex>
      {status !== 'open' && (
        <Form.Item
          label="Assignee"
          name="assignee"
          rules={[{ required: status !== 'closed', message: 'An assigned or blocked ticket needs an assignee' }]}
        >
          <Select allowClear options={assignees.map((a) => ({ value: a.id, label: a.name }))} />
        </Form.Item>
      )}
      {status === 'blocked' && (
        <Form.Item label="Blocked because" name="blockedReason" rules={[{ required: true, whitespace: true, message: 'A blocked ticket needs a reason' }]}>
          <Input />
        </Form.Item>
      )}
      <Form.Item label="Due date" name="dueDate">
        <Input type="date" style={{ width: 200 }} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={saving}>
        {submitLabel}
      </Button>
    </Form>
  );
}
