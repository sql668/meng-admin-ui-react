import { Engine } from '@form-created/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@form-created/formily-transformer'
import { message } from 'antd'

export const saveSchema = (designer: Engine) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema') || ''))
    )
  } catch {}
}

export const setCaseSchema = (designer: Engine,schema:any) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(schema)
    )
  } catch {}
}
