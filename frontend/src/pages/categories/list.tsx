import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Button } from "antd";
import { useTableCustomization } from "../../hooks/useTableCustomization";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const baseColumns = [
    {
      defaultTitle: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      defaultTitle: "Title",
      dataIndex: "title",
      key: "title",
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

  const { processedColumns, showCustomizeModal, renderCustomizeModal } = useTableCustomization(baseColumns);

  return (
    <List
      headerButtons={[
        <Button key="customize" onClick={showCustomizeModal}>
          Customize Table
        </Button>
      ]}
    >
      <Table {...tableProps} rowKey="id">
        {processedColumns
          .filter(column => !column.hidden)
          .map(({ hidden, defaultTitle, key, ...columnProps }) => (
            <Table.Column key={key} {...columnProps} />
          ))}
      </Table>
      {renderCustomizeModal()}
    </List>
  );
};
