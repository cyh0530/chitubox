import React, { useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
  Select,
} from "antd";
import { defaultValueCFG, defaultValueModels } from "./default";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Model = ({ brand, models }) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [data, setData] = useState(defaultValueModels[brand] || defaultValueModels["Default"]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Resin",
      dataIndex: "__resin",
      width: "16%",
    },
    {
      title: "Color",
      dataIndex: "color",
      width: "16%",
      render: (text, row) => {
        switch (row.__resin) {
          case "Basic":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="White">White</Option>
                  <Option value="Grey">Grey</Option>
                  <Option value="Matte Black">Matte Black</Option>
                  <Option value="Yellow">Yellow</Option>
                  <Option value="Pink">Pink</Option>
                  <Option value="Blue">Blue</Option>
                  <Option value="Green">Green</Option>
                  <Option value="Purple">Purple</Option>
                </Select>
              </Form.Item>
            );
          case "PP Like":
          case "Flex 52D":
          case "Flex 57A":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Clear">Clear</Option>
                </Select>
              </Form.Item>
            );
          case "Engineering Strong":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="White">White</Option>
                  <Option value="Clear">Clear</Option>
                  <Option value="Grey">Grey</Option>
                </Select>
              </Form.Item>
            );
          case "Engineering HT":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Clear">Clear</Option>
                </Select>
              </Form.Item>
            );
          case "HD 4K":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Grey">Grey</Option>
                </Select>
              </Form.Item>
            );
          case "Fast 500":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Grey">Grey</Option>
                </Select>
              </Form.Item>
            );
          case "Castable":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Purple">Purple</Option>
                </Select>
              </Form.Item>
            );
          case "Dental Model":
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="White">White</Option>
                </Select>
              </Form.Item>
            );
          default:
            return (
              <Form.Item name="color" style={{ width: "100%" }}>
                <Select defaultValue={row.color}>
                  <Option value="Clear">Clear</Option>
                </Select>
              </Form.Item>
            );
        }
      },
    },
    {
      title: "Layer Thickness (um)",
      dataIndex: "layerThickness",
      width: "16%",
      editable: true,
    },
    {
      title: "Base Layer Count",
      dataIndex: "baseLayerCount",
      width: "16%",
      editable: true,
    },
    {
      title: "Base Exposure Time (s)",
      dataIndex: "baseExposureTime",
      width: "16%",
      editable: true,
    },
    {
      title: "Layer Exposure Time (s)",
      dataIndex: "layerExposureTime",
      width: "16%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              //href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "layerThickness" ||
          col.dataIndex === "baseLayerCount" ||
          col.dataIndex === "baseExposureTime" ||
          col.dataIndex === "layerExposureTime"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onFinish = (values) => {
    console.log(values);
    const models = values.models || [];
    for (let model of models) {
      for (let row of data) {
        console.log(brand, model);
        console.log(row);
        let result = defaultValueCFG[brand][model];
        for (let key in row) {
          if (key !== "key") result[key] = row[key];
        }
        const brandReplace = brand.replace(" ", "_");
        const modelReplace = model.replace(" ", "_");

        const resin = row.__resin.replace(" ", "_");
        const color = row.color.replace(" ", "_");
        const element = document.createElement("a");
        let cfg = "";
        for (let key in result) {
          cfg = cfg.concat(`${key}:${result[key]}\n`);
        }
        const file = new Blob([cfg], {
          type: "text/plain;charset=utf-8",
        });
        element.href = URL.createObjectURL(file);
        element.download = `_${brandReplace}_${modelReplace}_${resin}_${color}_profile.cfg`;
        document.body.appendChild(element);
        element.click();
      }
    }
  };
  return (
    <div style={{ width: 800, padding: 15 }}>
      <Form name={brand} form={form} onFinish={onFinish} component={false}>
        <h3>{brand}</h3>
        <Form.Item label="Models" name="models">
          <Select mode="multiple" style={{ width: 200 }}>
            {models.map((model) => (
              <Option value={model} key={model}>
                {model}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Table
          size="small"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Form.Item style={{ marginTop: 15 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            Download
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Model;
