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
import { Space, Table, Button, Modal, Form, Input, Checkbox } from "antd";
import { useState } from "react";

export const BlogPostList: React.FC = () => {
  // Change state to store only customizations
  const [columnCustomizations, setColumnCustomizations] = useState<Record<string, { title?: string; visible: boolean }>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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

  // Define base columns first
  const baseColumns = [
    {
      defaultTitle: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      defaultTitle: "Content",
      dataIndex: "content",
      key: "content",
      render: (value: string) => (
        <MarkdownField value={value.slice(0, 80) + "..."} />
      ),
    },
    {
      defaultTitle: "Category",
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
      defaultTitle: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => <DateField value={value} />,
    },
    {
      defaultTitle: "Actions",
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

  // Process columns with customizations
  const columns = baseColumns.map(column => ({
    ...column,
    title: columnCustomizations[column.key]?.title ?? column.defaultTitle,
    hidden: columnCustomizations[column.key]?.visible === false,
  }));

  const showModal = () => {
    // Set form values based on current column settings
    form.setFieldsValue(
      baseColumns.reduce((acc, column) => ({
        ...acc,
        [`${column.key}_title`]: columnCustomizations[column.key]?.title ?? column.defaultTitle,
        [`${column.key}_visible`]: columnCustomizations[column.key]?.visible ?? true,
      }), {})
    );
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Convert form values to columnCustomizations format
      const newCustomizations = baseColumns.reduce((acc, column) => {
        const customTitle = values[`${column.key}_title`];
        const visible = values[`${column.key}_visible`];
        const isDefault = customTitle === column.defaultTitle && visible === true;

        // Only store non-default values
        if (!isDefault) {
          acc[column.key] = {
            title: customTitle,
            visible,
          };
        }
        return acc;
      }, {});

      setColumnCustomizations(newCustomizations);
      setIsModalVisible(false);
    });
  };

  return (
    <List
      headerButtons={[
        <Button key="customize" onClick={showModal}>
          Customize Table
        </Button>
      ]}
    >
      <Table {...tableProps} rowKey="id">
        {columns
          .filter(column => !column.hidden)
          .map(({ hidden, defaultTitle, ...columnProps }) => (
            <Table.Column {...columnProps} />
          ))}
      </Table>

      <Modal
        title="Customize Table"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          {baseColumns.map((column) => (
            <div key={column.key} style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'flex-start',
              marginBottom: '16px' 
            }}>
              <Form.Item 
                name={`${column.key}_title`} 
                label={`${column.defaultTitle} Column`}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name={`${column.key}_visible`} 
                valuePropName="checked"
                style={{ marginBottom: 0, marginTop: '29px' }}
              >
                <Checkbox>Show</Checkbox>
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
    </List>
  );
};
