import { List } from "@refinedev/core";
import { CrystalTable } from "../../components/CrystalTable";

export const CategoryList = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <List>
      <CrystalTable
        resource="categories"
        columns={columns}
        scroll={{ x: true }}
      />
    </List>
  );
};
