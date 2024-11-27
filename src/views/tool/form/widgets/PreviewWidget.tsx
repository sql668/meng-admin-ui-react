import React, { useMemo } from 'react'
import { Form as AForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  //Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
} from '@formily/antd-v5'
import { Card, Slider, Rate, Button } from 'antd'
import { Switch} from "@fdesign/component"
import { createExtForm, TreeNode } from '@form-created/core'
import { transformToSchema } from '@form-created/formily-transformer'
import { Slot } from '@form-created/formily-antd'

const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    Slot,
  },
})

export interface IPreviewWidgetProps {
  tree: TreeNode
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {

   const slot = (form: AForm) => {
    return useMemo(() => {
      return (
        <>
          <Button
            onClick={() => {
              console.log(form.query('input').value());
              console.log(form.values);
              form.submit();
            }}
          >
            测试按钮
          </Button>
          ;
          <Submit
            onSubmit={(values) => {
              return new Promise<void>((_,reject) => {
                setTimeout(() => {
                  console.log(values);
                  reject("接口异常");
                }, 2000);
              });
            }}
            onSubmitFailed={console.log}
          >
            提交
          </Submit>
        </>
      );
    }, [form]);
   };
  
  const form:any = useMemo(() => createExtForm({
    extConfig: {
      slots: {
        default: () => <Text content="This is a preview" />,
        p1: slot
      }
    }
  }), [])
  const { form: formProps, schema } = transformToSchema(props.tree)
  return (
    <Form {...formProps} form={form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
