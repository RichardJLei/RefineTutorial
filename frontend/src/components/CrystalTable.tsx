import { Table, TableProps } from "antd";
import { useTable } from "@refinedev/antd";

type CrystalTableProps<T> = TableProps<T> & {
  resource: string;
  columns: any[];
};

export const CrystalTable = <T extends object>({
  resource,
  columns,
  ...tableProps
}: CrystalTableProps<T>) => {
  const { tableProps: refinedTableProps } = useTable<T>({
    resource,
  });

  return (
    <Table<T>
      {...refinedTableProps}
      {...tableProps}
      columns={columns}
      rowKey="id"
      pagination={{
        ...refinedTableProps.pagination,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
      bordered
      size="middle"
      scroll={{ x: "max-content" }}
      rowSelection={{
        type: "checkbox",
        onChange: (selectedRowKeys) => {
          console.log("Selected rows:", selectedRowKeys);
        },
      }}
    />
  );
}; 