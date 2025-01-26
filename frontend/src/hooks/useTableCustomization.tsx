import { useState } from "react";
import { Form, Modal, Input, Checkbox, Space } from "antd";

interface ColumnDefinition {
  defaultTitle: string;
  key: string;
  dataIndex: string | string[];
  render?: (value: any, record: any) => React.ReactNode;
  [key: string]: any;
}

interface TableCustomization {
  title?: string;
  visible: boolean;
  sortable?: boolean;
}

// Add type for the accumulator in reduce
type CustomizationAccumulator = {
  [key: string]: TableCustomization;
};

export const useTableCustomization = (baseColumns: ColumnDefinition[]) => {
  const [columnCustomizations, setColumnCustomizations] = useState<Record<string, TableCustomization>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Process columns with customizations
  const processedColumns = baseColumns.map(column => ({
    ...column,
    title: columnCustomizations[column.key]?.title ?? column.defaultTitle,
    hidden: columnCustomizations[column.key]?.visible === false,
    sorter: columnCustomizations[column.key]?.sortable ? true : undefined,
  }));

  const showCustomizeModal = () => {
    form.setFieldsValue(
      baseColumns.reduce((acc, column) => ({
        ...acc,
        [`${column.key}_title`]: columnCustomizations[column.key]?.title ?? column.defaultTitle,
        [`${column.key}_visible`]: columnCustomizations[column.key]?.visible ?? true,
        [`${column.key}_sortable`]: columnCustomizations[column.key]?.sortable ?? false,
      }), {})
    );
    setIsModalVisible(true);
  };

  const handleCustomizeOk = () => {
    form.validateFields().then((values) => {
      const newCustomizations = baseColumns.reduce((acc: CustomizationAccumulator, column) => {
        const customTitle = values[`${column.key}_title`];
        const visible = values[`${column.key}_visible`];
        const sortable = values[`${column.key}_sortable`];
        const isDefault = customTitle === column.defaultTitle && 
                         visible === true && 
                         sortable === false;

        if (!isDefault) {
          acc[column.key] = {
            title: customTitle,
            visible,
            sortable,
          };
        }
        return acc;
      }, {});

      setColumnCustomizations(newCustomizations);
      setIsModalVisible(false);
    });
  };

  const renderCustomizeModal = () => (
    <Modal
      title="Customize Table"
      open={isModalVisible}
      onOk={handleCustomizeOk}
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
            <Space style={{ marginTop: '29px' }}>
              <Form.Item 
                name={`${column.key}_visible`} 
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Checkbox>Show</Checkbox>
              </Form.Item>
              <Form.Item 
                name={`${column.key}_sortable`} 
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Checkbox>Sort</Checkbox>
              </Form.Item>
            </Space>
          </div>
        ))}
      </Form>
    </Modal>
  );

  return {
    processedColumns,
    showCustomizeModal,
    renderCustomizeModal,
  };
}; 