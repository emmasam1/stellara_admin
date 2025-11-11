import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import axios from "axios";
import { useApp } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, BASE_URL } = useApp();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, values);

      // Always destructure from res.data
      const { token } = res.data;
      // console.log(res)

      // Save token + user to context (sessionStorage is auto-handled)
      setToken(token);

      messageApi.success(res?.data?.message);
      navigate("/dashboard"); 
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      {contextHolder}
      <div className="bg-[url(/src/assets/background.jpg)] bg-cover bg-center object- h-screen">
        <div className="h-screen w-full bg-[#00000078] flex items-center justify-center">
          <Card className="w-[80%] sm:w-[350px] shadow-2xl rounded-2xl">
            <div className="flex justify-center items-center py-3">
              <img src={logo} alt="" className="w-50" />
            </div>
            <h1 className="font-bold text-3xl text-center">Welcome Back!</h1>
            <p className="text-center text-sm py-4">
              Your trusted shopping partner —{" "}
              <span className="font-semibold">Stellara Store</span>
            </p>

            <Form layout="vertical" onFinish={onFinish}>
              {/* Email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
                <Input
                  // prefix={<MailOutlined className="text-gray-500" />}
                  placeholder="Enter your email"
                  size="large"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              {/* Login Button */}
              <div className="flex justify-end !mt-4">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!rounded-mg !px-6 !bg-[#CDA434]"
                    size="medium"
                    loading={loading}
                  >
                    Login
                    <MdOutlineArrowRightAlt className="!w-6 h-3" />
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
