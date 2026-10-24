import { App, Button, Flex, Form, Input, Select } from 'antd';
import { PRIORITIES, STATUSES } from '@tickets/logic';
import axios from 'axios';

export const NEW_TICKET = { title: '', priority: 'medium', status: 'open' };

// The form's fields for an existing ticket.
export function toFormValues(ticket) {
  return {
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignee: ticket.assignee,
    blockedReason: ticket.blockedReason,
    dueDate: ticket.dueDate ?? undefined,
  };
}

// What the API expects, from the form's fields.
function toInput(values) {
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

// The Python API answers 400 with { errors: [{ field, message }] }.
function serverFieldErrors(error) {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return [];
  return (error.response.data.errors ?? []).map((e) => ({ name: e.field, errors: [e.message] }));
}

// form comes from Form.useForm() in the page, so the page can fill it in.
export default function TicketForm({ form, assignees, saving, submitLabel, onSave }) {
  const { message } = App.useApp();
  const status = Form.useWatch('status', form) ?? NEW_TICKET.status;

  async function finish(values) {
    try {
      await onSave(toInput(values));
    } catch (error) {
      const fields = serverFieldErrors(error);
      if (fields.length > 0) form.setFields(fields);
      else message.error(error.message ?? 'Could not save the ticket');
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={NEW_TICKET} onFinish={finish} style={{ maxWidth: 560 }}>
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
