import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Select,
  message,
  Card,
  Popconfirm,
  Image,
  Upload,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useApp } from "../../context/AppContext";
import Loader from "../../components/Loader";
import { RiWhatsappFill, RiInstagramFill, RiFacebookFill } from "react-icons/ri";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { token, BASE_URL } = useApp();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
      console.log(res)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const showModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        socialMedia: product.socialMedia || {},
      });
      setFileList([
        {
          uid: "-1",
          name: "Current Image",
          status: "done",
          url: product.image,
        },
      ]);
    } else {
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
    setPreviewOpen(false);
    setEditingProduct(null);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) message.error("You can only upload image files!");
    return isImage || Upload.LIST_IGNORE;
  };

  const handleSubmit = async (values) => {
    if (!token) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("oldPrice", values.oldPrice || values.price);
      formData.append("category", values.category);
      formData.append(
        "socialMedia",
        JSON.stringify({
          whatsapp: values?.socialMedia?.whatsapp || "",
          instagram: values?.socialMedia?.instagram || "",
          facebook: values?.socialMedia?.facebook || "",
        })
      );

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      let res;
      if (editingProduct) {
        res = await axios.put(`${BASE_URL}/api/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.post(`${BASE_URL}/api/products`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
      }

      console.log(res)
      messageApi.success(res.data.message || "Product saved!");
      handleCancel();
      getProducts();
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      messageApi.success("Product deleted successfully!");
      getProducts();
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Failed to delete product.");
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="p-4">
      {contextHolder}

      <div className="flex justify-end mb-4">
        <Button onClick={() => showModal()} className="!bg-[#CDA434] !text-white !border-0">
          Add Product
        </Button>
      </div>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width="90%"
        style={{ maxWidth: 600 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-3">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label="Price (₦)"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>

            <Form.Item label="Old Price (₦)" name="oldPrice">
              <Input type="number" placeholder="Optional old price" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select placeholder="Select a category">
                <Option value="perfumes">Perfumes</Option>
                <Option value="bags">Bags</Option>
                <Option value="shoes">Shoes</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label="WhatsApp Number"
              name={["socialMedia", "whatsapp"]}
              rules={[
                { required: true, message: "Please enter WhatsApp number" },
                { pattern: /^[0-9]{10,15}$/, message: "Enter valid number" },
              ]}
            >
              <Input placeholder="e.g. 2347063062524" />
            </Form.Item>

            <Form.Item label="Instagram Link" name={["socialMedia", "instagram"]}>
              <Input placeholder="https://instagram.com/username" />
            </Form.Item>

            <Form.Item label="Facebook Link" name={["socialMedia", "facebook"]}>
              <Input placeholder="https://facebook.com/username" />
            </Form.Item>

            <Form.Item
              label="Product Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[{ required: !editingProduct, message: "Please upload product image" }]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                onRemove={() => setFileList([])}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    src: previewImage,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterClose: () => setPreviewImage(""),
                  }}
                />
              )}
            </Form.Item>
          </div>

          <div className="flex justify-center">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!bg-[#CDA434] !text-white !border-0"
              >
                {editingProduct ? "Update Product" : "Save Product"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {products.map((product) => (
            <Card
              key={product._id}
              hoverable
              className="w-full"
              cover={<img alt={product.name} src={product.image} className="h-48 w-full object-cover" />}
            >
              <h1 className="font-bold text-sm md:text-base">{product.name}</h1>
              <p className="text-sm md:text-base">
                {product.oldPrice && product.oldPrice !== product.price && (
                  <span className="line-through text-gray-400 mr-2">₦{product.oldPrice}</span>
                )}
                <span>₦{product.price}</span>
              </p>

              <div className="flex gap-2 mt-2 text-lg md:text-xl">
                {product.socialMedia?.whatsapp && (
                  <a href={`https://wa.me/${product.socialMedia.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <RiWhatsappFill className="text-green-500" />
                  </a>
                )}
                {product.socialMedia?.instagram && (
                  <a href={product.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    <RiInstagramFill className="text-pink-500" />
                  </a>
                )}
                {product.socialMedia?.facebook && (
                  <a href={product.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                    <RiFacebookFill className="text-blue-600" />
                  </a>
                )}
              </div>

              <div className="flex justify-between items-center mt-3">
                <Button icon={<EditOutlined />} size="small" onClick={() => showModal(product)} />
                <Popconfirm
                  title="Are you sure to delete this product?"
                  okText="Yes"
                  okType="danger"
                  cancelText="No"
                  onConfirm={() => deleteProduct(product._id)}
                >
                  <Button icon={<DeleteOutlined />} size="small" danger />
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
