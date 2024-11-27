import  { useEffect, useState } from 'react'
import { Space, Button, Radio, message } from 'antd'
import { useDesigner, TextWidget } from '@form-created/react'
import { GlobalRegistry } from '@form-created/core'
import { observer } from '@formily/react'
import { loadInitialSchema } from '../service'
import { EditForm } from '../component/form'
import { FormInfoModel } from '../type'
import { isFalse } from '@/utils/util'
import { getFormGenerateById, insertFormGenerateApi, updateFormGenerateApi } from '@/api/tools/form-generate'
import { transformToSchema, transformToTreeNode } from '@form-created/formily-transformer'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

export const InitFormData: FormInfoModel = {
  sort: 1,
  status: 1,
  formName: "",
  isModel: false,
}


export const ActionsWidget = observer(() => {
  const designer = useDesigner()
  const params = useParams()
  const queryClient = useQueryClient()
  const [formInit, setFormInit] = useState<FormInfoModel>(InitFormData)
  useEffect(() => {
    loadInitialSchema(designer)
    if (params.id) {
      getFormGenerateById(+params.id).then((res) => {
        if (res.code === 0) {
          setFormInit(res.data!)
          console.log(JSON.parse(res.data?.jsonSchema || ''))
          designer.setCurrentTree(
            transformToTreeNode(JSON.parse(res.data?.jsonSchema || '')),
          )
        }
      })
    } 
  }, [params])
  const supportLocales = ['zh-cn', 'en-us', 'ko-kr']
  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn')
    }
  }, [])

  const [modalTitle, setModalTitle] = useState('添加部门')
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormInfoModel>(InitFormData)
  const editFormOk = (values: FormInfoModel, allValues: FormInfoModel): Promise<boolean> => {
    const api = isFalse(allValues.formId) ? insertFormGenerateApi : updateFormGenerateApi
    values.jsonSchema = JSON.stringify(transformToSchema(designer.getCurrentTree()))
    return api(values, allValues.formId || 0)
      .then((res) => {
        if (res.code === 0) {
          setOpen(false)
          message?.success(res.msg)
          setFormInit(values)
          queryClient.invalidateQueries({ queryKey: ['tools/form', 'list', 'get'] })
          return Promise.resolve(false)
        } else {
          message?.error(res.msg)
          return Promise.reject()
        }
      })
      .catch((err) => {
        message?.error(err.message)
        return Promise.reject(err)
      })
  }
  const editFormCancel = () => {
    setOpen(false)
  }
  
  return (
    <Space style={{ marginRight: 10 }}>
      {/* <Button href="https://designable-fusion.formilyjs.org">
        Alibaba Fusion
      </Button> */}
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType='button'
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          // { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      {/* <Button href="https://github.com/alibaba/designable" target="_blank">
        <GithubOutlined />
        Github
      </Button> */}
      <Button
        onClick={() => {
          setFormData(formInit)
          setOpen(true)
          setModalTitle('保存')
          //saveSchema(designer)
        }}>
        <TextWidget>Save</TextWidget>
      </Button>
      {/* <Button
        type="primary"
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Publish</TextWidget>
      </Button> */}

      <EditForm
        title={modalTitle}
        open={open}
        initalData={formData}
        onCancel={editFormCancel}
        onSubmit={editFormOk}></EditForm>
    </Space>
  )
})