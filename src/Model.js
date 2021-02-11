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
  Row,
  Col,
} from "antd";
import { defaultValueCFG, defaultValueModels, resinColors } from "./default";
import jszip from "jszip";
import { saveAs } from "file-saver";

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
  const [data, setData] = useState(
    defaultValueModels[brand] || defaultValueModels["Default"]
  );
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
      title: "Layer Thickness (um)",
      dataIndex: "layerHeight",
      width: "16%",
      editable: true,
    },
    {
      title: "Base Layer Count",
      dataIndex: "bottomLayerCount",
      width: "16%",
      editable: true,
    },
    {
      title: "Base Exposure Time (s)",
      dataIndex: "bottomLayerExposureTime",
      width: "16%",
      editable: true,
    },
    {
      title: "Layer Exposure Time (s)",
      dataIndex: "normalExposureTime",
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
          col.dataIndex === "layerHeight" ||
          col.dataIndex === "bottomLayerCount" ||
          col.dataIndex === "bottomLayerExposureTime" ||
          col.dataIndex === "normalExposureTime"
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
    const zip = jszip();
    for (let model of models) {
      let cfgForAll = "";
      for (let row of data) {
        console.log(brand, model);
        console.log(row);
        let result = defaultValueCFG[brand][model];
        for (let key in row) {
          if (key === "key") continue;

          if (key === "layerHeight") {
            const data = row[key] * 0.001;
            result[key] = data;
          } else {
            result[key] = row[key];
          }
        }
        const resin = row.__resin;
        for (let color of resinColors[resin]) {
          console.log(`download ${brand} ${model} ${resin} ${color}`);
          const folder = zip.folder(resin);
          downloadFile(brand, model, resin, color, result, folder);
        }
        for (let color of resinColors[resin]) {
          for (let key in result) {
            cfgForAll = cfgForAll.concat(
              `@@QTS ${resin} ${color}@@${key}:${result[key]}\n`
            );
          }
        }
      }
      downloadAll(brand, model, cfgForAll, zip);
      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, `${brand} ${model}.zip`);
      });
    }
  };

  const downloadAll = (brand, model, cfg, zip) => {
    const brandReplace = brand.replace(" ", "_");
    const modelReplace = model.replace(" ", "_");

    // const element = document.createElement("a");

    for (let key in defaultValueCFG[brand][model]) {
      cfg = cfg.concat(`${key}:${defaultValueCFG[brand][model][key]}\n`);
    }

    const file = new Blob([cfg], {
      type: "text/plain;charset=utf-8",
    });
    const fileName = `_${brandReplace}_${modelReplace}_all_profile.cfg`;
    zip.file(fileName, file);

    // element.href = URL.createObjectURL(file);
    // element.download = `_${brandReplace}_${modelReplace}_all_profile.cfg`;
    // document.body.appendChild(element);
    // element.click();
  };

  const downloadFile = (brand, model, resin, color, result, folder) => {
    const brandReplace = brand.replace(" ", "_");
    const modelReplace = model.replace(" ", "_");
    const resinReplace = resin.replace(" ", "_");
    const colorReplace = color.replace(" ", "_");

    // const element = document.createElement("a");
    let cfg = "";
    for (let key in result) {
      cfg = cfg.concat(`@@QTS ${resin} ${color}@@${key}:${result[key]}\n`);
    }
    for (let key in result) {
      cfg = cfg.concat(`${key}:${result[key]}\n`);
    }
    const file = new Blob([cfg], {
      type: "text/plain;charset=utf-8",
    });
    const fileName = `_${brandReplace}_${modelReplace}_QTS_${resinReplace}_${colorReplace}_profile.cfg`;
    folder.file(fileName, file);
    // element.href = URL.createObjectURL(file);
    // document.body.appendChild(element);
    // element.click();
  };
  return (
    <div style={{ width: 800, padding: 15 }}>
      <Form name={brand} form={form} onFinish={onFinish} component={false}>
        <h3>{brand}</h3>
        <Row gutter={20}>
          <Col>
            <Form.Item label="Models" name="models">
              <Select mode="multiple" style={{ width: 200 }}>
                {models.map((model) => (
                  <Option value={model} key={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
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
          </Col>
        </Row>

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
      </Form>
    </div>
  );
};

export default Model;
