import React, { useEffect, useState } from "react";
import { Card, Skeleton } from "antd";
import axios from "axios";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  SkinOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useApp } from "../../context/AppContext";

const Dashboard = () => {
  const { BASE_URL } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setItems(res?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [BASE_URL]);

  const crates = [
    {
      title: "All Products",
      count: items.length,
      icon: <ShoppingOutlined className="text-3xl text-white" />,
      color: "!bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500",
    },
    {
      title: "Bags",
      count: items.filter((item) => item.category === "bags").length,
      icon: <ShoppingCartOutlined className="text-3xl text-white" />,
      color: "!bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600",
    },
    {
      title: "Perfumes",
      count: items.filter((item) => item.category === "perfumes").length,
      icon: <SkinOutlined className="text-3xl text-white" />,
      color: "!bg-gradient-to-r from-pink-400 via-rose-500 to-red-500",
    },
    {
      title: "Beddings",
      count: items.filter((item) => item.category === "beddings").length,
      icon: <HomeOutlined className="text-3xl text-white" />,
      color: "!bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="shadow-lg rounded-2xl">
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            ))
        : crates.map((crate, index) => (
            <Card
              key={index}
              className={`shadow-lg rounded-2xl text-white ${crate.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{crate.title}</h2>
                  <p className="text-2xl font-bold mt-2">{crate.count}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">{crate.icon}</div>
              </div>
            </Card>
          ))}
    </div>
  );
};

export default Dashboard;
