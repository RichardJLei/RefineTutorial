import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";

export const BlogPostList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "categories",
    ids: tableProps?.dataSource?.map((item) => item?.category?.id) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (value: string) => (
        <MarkdownField value={value.slice(0, 80) + "..."} />
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "id"],
      key: "category.id",
      render: (value: number) =>
        categoryIsLoading ? (
          <>Loading...</>
        ) : (
          categoryData?.data?.find((item) => item.id === value)?.title
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => <DateField value={value} />,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: string, record: BaseRecord) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <ShowButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        {columns.map(({ key, ...columnProps }) => (
          <Table.Column key={key} {...columnProps} />
        ))}
      </Table>
    </List>
  );
};
