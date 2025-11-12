import React, { useState, useMemo, useEffect } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import { FiPieChart, FiBox } from "react-icons/fi";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import logo from "../../assets/logo.png";

const { Header, Content, Sider } = Layout;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // widths & heights
  const headerHeight = 64;
  const siderWidth = useMemo(() => (collapsed ? 80 : 220), [collapsed]);

  const items = [
    { key: "/dashboard", icon: <FiPieChart />, label: "Dashboard" },
    { key: "/dashboard/products", icon: <FiBox />, label: "Products" },
  ];

  // ✅ Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Fixed Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#202020",
          overflow: "auto",
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: headerHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #2b2b2b",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: collapsed ? 70 : 170, transition: "width .2s" }}
          />
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={items}
          style={{ background: "#202020", borderRight: 0 }}
        />
      </Sider>

      {/* Fixed Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: siderWidth,
          right: 0,
          height: headerHeight,
          background: "#202020",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          zIndex: 1100,
          transition: "left .2s ease",
        }}
      >
        {/* Collapse Trigger */}
        <div
          onClick={() => setCollapsed((c) => !c)}
          style={{
            fontSize: 20,
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        </div>

        <div style={{ marginLeft: 12, fontWeight: 600 }}>Stellara Admin</div>
      </Header>

      {/* Content */}
      <Content
        style={{
          marginLeft: siderWidth,
          padding: "16px",
          paddingTop: headerHeight + 24,
          transition: "margin-left .2s ease",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            minHeight: `calc(100vh - ${headerHeight + 56}px)`,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
