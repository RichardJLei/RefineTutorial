import { List } from "@refinedev/antd";
import { useMany } from "@refinedev/core";
import { CrystalTable } from "../../components/CrystalTable";

export const BlogPostList = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
  ];

  return (
    <List>
      <CrystalTable
        resource="blog_posts"
        columns={columns}
        scroll={{ x: true }}
      />
    </List>
  );
};
