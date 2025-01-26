import { useState } from "react";
import { Form, Modal, Input, Checkbox, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";

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
  filterable?: boolean;
}

// Add type for the accumulator in reduce
type CustomizationAccumulator = {
  [key: string]: TableCustomization;
};

export const useTableCustomization = (baseColumns: ColumnDefinition[]) => {
  const [columnCustomizations, setColumnCustomizations] = useState<Record<string, TableCustomization>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Add state for search text and filtered columns
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [searchedColumns, setSearchedColumns] = useState<string[]>([]);

  const handleSearch = (key: string, value: string) => {
    setSearchText(prev => ({ ...prev, [key]: value }));
    setSearchedColumns(prev => 
      value ? [...new Set([...prev, key])] : prev.filter(k => k !== key)
    );
  };

  const handleReset = (key: string) => {
    setSearchText(prev => ({ ...prev, [key]: '' }));
    setSearchedColumns(prev => prev.filter(k => k !== key));
  };

  // Process columns with customizations
  const processedColumns = baseColumns.map(column => {
    const baseColumn = {
      ...column,
      title: columnCustomizations[column.key]?.title ?? column.defaultTitle,
      hidden: columnCustomizations[column.key]?.visible === false,
      sorter: columnCustomizations[column.key]?.sortable ? true : undefined,
    };

    // Add filter functionality if enabled
    if (columnCustomizations[column.key]?.filterable) {
      return {
        ...baseColumn,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${baseColumn.title}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => {
                confirm();
                handleSearch(column.key, selectedKeys[0]);
              }}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  confirm();
                  handleSearch(column.key, selectedKeys[0]);
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters?.();
                  handleReset(column.key);
                  confirm();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: string, record: any) => {
          const fieldValue = Array.isArray(column.dataIndex)
            ? column.dataIndex.reduce((obj, key) => obj?.[key], record)
            : record[column.dataIndex];
          return fieldValue
            ? String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
            : false;
        },
        filteredValue: searchedColumns.includes(column.key) ? [searchText[column.key]] : null,
      } as ColumnType<any>;
    }

    return baseColumn;
  });

  const showCustomizeModal = () => {
    form.setFieldsValue(
      baseColumns.reduce((acc, column) => ({
        ...acc,
        [`${column.key}_title`]: columnCustomizations[column.key]?.title ?? column.defaultTitle,
        [`${column.key}_visible`]: columnCustomizations[column.key]?.visible ?? true,
        [`${column.key}_sortable`]: columnCustomizations[column.key]?.sortable ?? false,
        [`${column.key}_filterable`]: columnCustomizations[column.key]?.filterable ?? false,
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
        const filterable = values[`${column.key}_filterable`];
        const isDefault = customTitle === column.defaultTitle && 
                         visible === true && 
                         sortable === false &&
                         filterable === false;

        if (!isDefault) {
          acc[column.key] = {
            title: customTitle,
            visible,
            sortable,
            filterable,
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
              <Form.Item 
                name={`${column.key}_filterable`} 
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Checkbox>Filter</Checkbox>
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