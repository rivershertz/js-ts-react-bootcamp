# 03-react/06 Ant Design: Table, Form, theming, versions

**Time:** 15 min lesson, 50 min exercises (core), plus 15 min stretch.

## 1. Watch the lesson

Run `yarn lessons` and pick **03-react/06 Ant Design: Table, Form, theming, versions**.

## 2. Quick recap

- antd components are configured with props, not CSS. Each docs page ends with an API table; in VS Code, Ctrl+Space inside a tag lists the props.
- `Table`: type the columns as `TableColumnsType<Ticket>`. Each column has a `title`, a `dataIndex`, and maybe a `render`. Give the table `rowKey="id"` and `pagination={{ pageSize }}`.
- A column's `sorter` function makes antd sort the rows. `filters` plus `onFilter` adds a filter menu to the header.
- `Form`: each `Form.Item` has a `name`, a `label` and `rules`. `onFinish` runs only when every rule passes, with all the values.
- `initialValues` is read once, when the form mounts. To switch tickets, give the form a `key`, or call `form.setFieldsValue`.
- Version 5 themes with `<ConfigProvider theme={{ token: { ... } }}>`. Versions 3 and 4 use Less variables in the build config.
- Check `package.json` to see which antd a project uses. Versions 3, 4 and 5 differ in forms, styles, dates and icons.

## 3. Exercises

Open [`exercises.tsx`](exercises.tsx).

| Step | Level | Task |
| --- | --- | --- |
| 1 | core | `PriorityTag`: a coloured antd `Tag` per priority |
| 2 | core | `TicketTable`: typed columns, row keys, 5 per page |
| 3 | stretch | `TicketTable`: sort priorities from low to urgent |
| 4 | core | `TicketForm`: required fields with messages |
| 5 | core | `TicketForm`: edit an existing ticket |
| 6 | core | `ThemedApp`: the team's colour and corners |
| 7 | core | `antdMajorVersion`: read a `package.json` |
| 8 | stretch | `TicketTable`: filter by status |

See them in the browser:

```
yarn dev 03-react/06
```

Check them:

```
yarn verify 03-react/06
```

The final project's table and form are antd 5, written the same way.
