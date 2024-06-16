import { createForm, Form, Field, FieldDataSource } from '@formily/core'
import { action } from '@formily/reactive'
import {
  Form as AntdForm,
  FormProps,
} from '@formily/antd-v5'
import { useEffect, useMemo } from 'react'
import { FormAction } from './formAction'
import { SchemaField } from './base'
import React from 'react'

export interface BaseFormProps extends FormProps {
  schema: any
  mode?: 'search' | 'edit'
  form?: Form // 如果父组件不传递，就使用组件内部创建的
  initValues?: any
  loadDataGroup?: LoadRemoteDataSourceGroup
  onSubmit?: (values: any) => void
  onReset?: (form: Form) => void
}

type SearchFormProps = Omit<BaseFormProps, 'mode'>
type EditFormProps = Omit<BaseFormProps, 'mode'>

export interface LoadRemoteDataSource {
  (field: Field): Promise<FieldDataSource>
}

export interface LoadRemoteDataSourceGroup {
  [key:string]: LoadRemoteDataSource
}

export interface UseAsyncDataSource {
  (service: LoadRemoteDataSource):void
}

// const loadData = async (field: Field) => {
//   const linkage = field.query('linkage').get('value')
//   if (!linkage) return []
//   return new Promise<FieldDataSource>((resolve) => {
//     setTimeout(() => {
//       if (linkage === 1) {
//         resolve([
//           {
//             label: 'AAA',
//             value: 'aaa',
//           },
//           {
//             label: 'BBB',
//             value: 'ccc',
//           },
//         ])
//       } else if (linkage === 2) {
//         resolve([
//           {
//             label: 'CCC',
//             value: 'ccc',
//           },
//           {
//             label: 'DDD',
//             value: 'ddd',
//           },
//         ])
//       }
//     }, 1500)
//   })
// }

const useAsyncDataSource = (service: LoadRemoteDataSource) => (field: Field) => {
  field.loading = true
  service(field).then(
    action.bound?.((data) => {
      field.dataSource = data
      field.loading = false
    }),
  )
}


const SearchForm = (props: SearchFormProps) => {
  const { schema, onSubmit, onReset, ...formProps } = props
  const form = useMemo(() => createForm(), [])
  const rest = () => {
    if (onReset) {
      onReset(form)
    } else {
      form.reset()
    }
  }
  const scope = useMemo(() => {
    return {
      actionSlot: (
        <FormAction form={form} onSubmit={onSubmit} onReset={rest}></FormAction>
      ),
    }
  },[form])
  return (
    <div className='meng-admin-schema-form search'>
      <AntdForm {...formProps} form={form}>
        <SchemaField schema={schema} scope={ scope} />
      </AntdForm>

    </div>
  )
}

const EditForm = (props: EditFormProps) => {
  const {
    form = createForm(),
    schema,
    initValues,
    loadDataGroup,
    onSubmit,
    onReset,
    ...formProps
  } = props
  //const form = useMemo(() => createForm(), [])
  // const rest = () => {
  //   if (onReset) {
  //     onReset(form)
  //   } else {
  //     form.reset()
  //   }
  // }

  useEffect(() => {
    form.setValues(initValues)
    // return () => {
    //   form.reset("*")
    // }
  }, [initValues])
  const scope = useMemo(() => {
    return {
      useAsyncDataSource,
      loadDataGroup,
    }
  }, [form, loadDataGroup])
  return (
    <div className='meng-admin-schema-form edit'>
      <AntdForm {...formProps} form={form}>
        <SchemaField schema={schema} scope={scope} />
      </AntdForm>
    </div>
  )
}

function Base(props: BaseFormProps) {

  const { mode = 'search', ...formProps } = props
  return mode === 'search' ? (
    <SearchForm {...formProps}></SearchForm>
  ) : (
    <EditForm {...formProps}></EditForm>
  )
}
const BaseForm = React.memo(Base)
export { BaseForm }
