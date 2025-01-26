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
  // Modify state to include visibility
  const [columnSettings, setColumnSettings] = useState({
    title: { title: "Title", visible: true },
    content: { title: "Content", visible: true },
    category: { title: "Category", visible: true },
    createdAt: { title: "Created At", visible: true },
    actions: { title: "Actions", visible: true }
  });
  
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

  const showModal = () => {
    // Set both title and visibility values in form
    form.setFieldsValue({
      ...Object.keys(columnSettings).reduce((acc, key) => ({
        ...acc,
        [`${key}_title`]: columnSettings[key].title,
        [`${key}_visible`]: columnSettings[key].visible,
      }), {})
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Convert form values back to columnSettings format
      const newSettings = Object.keys(columnSettings).reduce((acc, key) => ({
        ...acc,
        [key]: {
          title: values[`${key}_title`],
          visible: values[`${key}_visible`],
        }
      }), {});
      setColumnSettings(newSettings);
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: columnSettings.title.title,
      dataIndex: "title",
      key: "title",
      hidden: !columnSettings.title.visible,
    },
    {
      title: columnSettings.content.title,
      dataIndex: "content",
      key: "content",
      hidden: !columnSettings.content.visible,
      render: (value: string) => (
        <MarkdownField value={value.slice(0, 80) + "..."} />
      ),
    },
    {
      title: columnSettings.category.title,
      dataIndex: ["category", "id"],
      key: "category.id",
      hidden: !columnSettings.category.visible,
      render: (value: number) =>
        categoryIsLoading ? (
          <>Loading...</>
        ) : (
          categoryData?.data?.find((item) => item.id === value)?.title
        ),
    },
    {
      title: columnSettings.createdAt.title,
      dataIndex: "createdAt",
      key: "createdAt",
      hidden: !columnSettings.createdAt.visible,
      render: (value: string) => <DateField value={value} />,
    },
    {
      title: columnSettings.actions.title,
      dataIndex: "actions",
      key: "actions",
      hidden: !columnSettings.actions.visible,
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
          .map(({ key, hidden, ...columnProps }) => (
            <Table.Column key={key} {...columnProps} />
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
          {Object.keys(columnSettings).map((key) => (
            <div key={key} style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'flex-start',
              marginBottom: '16px' 
            }}>
              <Form.Item 
                name={`${key}_title`} 
                label={`${columnSettings[key].title} Column`}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name={`${key}_visible`} 
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
