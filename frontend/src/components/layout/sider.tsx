import React from 'react';
import { Layout as AntdLayout, Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

export const Sider: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname;  // Get current path for menu selection

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/blog-posts',
      icon: <FileTextOutlined />,
      label: <Link to="/blog-posts">Blog Posts</Link>,
    },
    {
      key: '/categories',
      icon: <UnorderedListOutlined />,
      label: <Link to="/categories">Categories</Link>,
    },
    // ... other menu items
  ];

  return (
    <AntdLayout.Sider
      styles={{
        body: {
          height: "100vh",
          overflow: "auto",
          padding: "24px 0",
        }
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </AntdLayout.Sider>
  );
}; 