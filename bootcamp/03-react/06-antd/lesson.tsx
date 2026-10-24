import { Code, Deck, PredictSlide, RecapSlide, Slide, TitleSlide, type DeckMeta, type LessonProps } from '../../lessons/kit';

export const meta: DeckMeta = {
  id: '03-react/06',
  title: 'Ant Design: Table, Form, theming, versions',
  time: '15 min lesson · 55 min exercises',
  subtitle: "The team's component library: a typed Table, a validated Form, a theme, and how to tell versions 3, 4 and 5 apart.",
};

export default function Lesson(props: LessonProps) {
  return (
    <Deck meta={meta} {...props}>
      <TitleSlide chips={["The team's apps use antd 3, 4 and 5", 'This deck teaches 5, and how to spot the others']} />

      <Slide title="A component library is props all the way down" eyebrow="antd">
        <Code
          lang="tsx"
          code={`
import { Button, Tag } from 'antd';

<Tag color="red">urgent</Tag>
<Button type="primary" loading={saving} onClick={save}>Save</Button>`}
        />
        <ul>
          <li>You do not style antd with CSS. You choose props, and set the theme once for the whole app.</li>
          <li>
            Each component&apos;s docs page ends with an API table: every prop, its type and its default.
          </li>
          <li>
            In VS Code, press Ctrl+Space inside a tag to list its props. The types are the docs you always have.
          </li>
        </ul>
      </Slide>

      <Slide title="Table: typed columns" eyebrow="Table">
        <Code
          lang="tsx"
          code={`
const columns: TableColumnsType<Ticket> = [
  { title: 'Title', dataIndex: 'title' },
  { title: 'Due', dataIndex: 'dueDate', render: (due) => due ?? 'No date' },
];

<Table columns={columns} dataSource={tickets}
       rowKey="id" pagination={{ pageSize: 20 }} />`}
        />
        <div className="k-note">
          <code>dataIndex</code> picks the field; <code>render</code> turns it into anything. <code>TableColumnsType&lt;Ticket&gt;</code>{' '}
          checks each column against <code>Ticket</code>.
        </div>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
// Each ticket has an id, but no field called key
<Table columns={columns} dataSource={tickets} />`}
        question="What happens?"
        answer="The rows show, and the console warns that each row needs a key"
        explanation={
          <>
            antd looks for <code>record.key</code> by default. Without a key, a selected or expanded row can jump to another
            ticket after sorting: the same bug as an index key (module 01). <code>rowKey=&quot;id&quot;</code> fixes it.
          </>
        }
      />

      <Slide title="Sorting and filtering" eyebrow="Table columns">
        <Code
          lang="tsx"
          code={`
{
  title: 'Created',
  dataIndex: 'createdAt',
  sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
  filters: [{ text: 'This year', value: '2026' }],
  onFilter: (value, ticket) => ticket.createdAt.startsWith(String(value)),
}`}
        />
        <ul>
          <li>
            A <code>sorter</code> function: antd sorts the rows itself. A header click goes ascending, descending, unsorted.
          </li>
          <li>
            <code>sorter: true</code> plus the Table&apos;s <code>onChange</code>: you sort. The final project does this, to sort with
            your Phase 2 <code>sortTickets</code>.
          </li>
        </ul>
      </Slide>

      <Slide title="Form: fields, rules, onFinish" eyebrow="Form">
        <Code
          lang="tsx"
          code={`
<Form<TicketFormValues> onFinish={(values) => save.mutate(values)}>
  <Form.Item
    label="Title"
    name="title"
    rules={[{ required: true, message: 'Title is required' }]}
  >
    <Input />
  </Form.Item>
  <Button type="primary" htmlType="submit">Create</Button>
</Form>`}
        />
        <ul>
          <li>
            <code>Form.Item</code> with a <code>name</code> owns its input&apos;s value: no <code>useState</code>, no{' '}
            <code>onChange</code>.
          </li>
          <li>
            <code>onFinish</code> runs only when every rule passes, with all the values in one object.
          </li>
        </ul>
      </Slide>

      <PredictSlide
        lang="tsx"
        code={`
function EditPage({ ticket }: { ticket: Ticket }) {
  return <Form initialValues={ticket}>...</Form>;
}

// The user clicks Next: EditPage gets ticket t2 instead of t1`}
        question="What does the Title field show now?"
        answer="Still t1's title"
        explanation={
          <>
            Like <code>useState(initial)</code>, <code>initialValues</code> is read once, when the form mounts. Give each ticket its own
            form with <code>key=&#123;ticket.id&#125;</code> (module 03), or call <code>form.setFieldsValue</code>.
          </>
        }
      />

      <Slide title="Form.useForm: the form from the outside" eyebrow="Form instance">
        <Code
          lang="tsx"
          code={`
const [form] = Form.useForm<TicketFormValues>();
<Form form={form} ...>

// Fill fields
form.setFieldsValue({ title: 'Copy of ' + ticket.title });
// Back to initialValues
form.resetFields();
// Show a server error under a field
form.setFields([{ name: 'title', errors: ['Already taken'] }]);`}
        />
        <div className="k-note">
          The final project&apos;s form uses <code>setFields</code> to show the API&apos;s 400 errors under the right field.
        </div>
      </Slide>

      <Slide title="Theming in version 5: tokens" eyebrow="ConfigProvider">
        <Code
          lang="tsx"
          code={`
<ConfigProvider theme={{ token: { colorPrimary: '#0f766e', borderRadius: 4 } }}>
  <App />
</ConfigProvider>

const { token } = theme.useToken();   // read the theme in your own components
<div style={{ padding: token.padding, color: token.colorTextSecondary }} />`}
        />
        <ul>
          <li>A token is one design value. antd derives the rest: hover colours, focus rings, disabled states.</li>
          <li>No CSS file to import and no build step: version 5 writes its styles from JavaScript at run time.</li>
        </ul>
      </Slide>

      <Slide title="Three versions in the same team" eyebrow="Versions">
        <table className="k-table">
          <thead>
            <tr>
              <th></th>
              <th>antd 3</th>
              <th>antd 4</th>
              <th>antd 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Forms</td>
              <td className="mono">Form.create()</td>
              <td className="mono">Form.useForm()</td>
              <td className="mono">Form.useForm()</td>
            </tr>
            <tr>
              <td>Theme</td>
              <td>Less variables</td>
              <td>Less variables</td>
              <td>ConfigProvider tokens</td>
            </tr>
            <tr>
              <td>Styles</td>
              <td className="mono">antd/dist/antd.css</td>
              <td className="mono">antd/dist/antd.css</td>
              <td>nothing to import</td>
            </tr>
            <tr>
              <td>Dates</td>
              <td className="mono">moment</td>
              <td className="mono">moment</td>
              <td className="mono">dayjs</td>
            </tr>
            <tr>
              <td>Icons</td>
              <td className="mono">&lt;Icon type=&quot;edit&quot; /&gt;</td>
              <td className="mono">&lt;EditOutlined /&gt;</td>
              <td className="mono">&lt;EditOutlined /&gt;</td>
            </tr>
          </tbody>
        </table>
        <div className="k-note">
          Docs and answers online are usually for version 5. Check which version you are in before you copy an example.
        </div>
      </Slide>

      <Slide title="Which antd is this project on?" eyebrow="30-second check">
        <ol>
          <li>
            <code>package.json</code>, under <code>dependencies</code>: <code>&quot;antd&quot;: &quot;^4.24.0&quot;</code> means
            version 4 (<code>^</code> allows newer 4.x).
          </li>
          <li>
            <code>yarn.lock</code>, or <code>node_modules/antd/package.json</code>, has the exact version installed.
          </li>
          <li>
            No time to look? <code>getFieldDecorator</code> in the code means 3; <code>.less</code> theme files mean 3 or 4;{' '}
            <code>theme=&#123;&#123; token &#125;&#125;</code> means 5.
          </li>
        </ol>
      </Slide>

      <RecapSlide
        points={[
          'antd is props: pick them from the API table, or with Ctrl+Space in VS Code.',
          'Table: TableColumnsType<T>, dataIndex, render, rowKey="id", pagination.',
          'A sorter function sorts for you; sorter: true with onChange lets you sort.',
          'Form: Form.Item name and rules, onFinish gets valid values. initialValues are read once: use a key.',
          'Version 5 themes with ConfigProvider tokens; 3 and 4 with Less variables.',
          'Check package.json before you copy an example: 3, 4 and 5 differ in forms, styles and dates.',
        ]}
        next="Module 07: when a component renders too often, and how to measure it."
      />
    </Deck>
  );
}
