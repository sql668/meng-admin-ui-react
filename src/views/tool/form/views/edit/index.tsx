import {
  CaseWidget,
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workspace,
  WorkspacePanel,
} from '@form-created/react'
import { createDesigner, GlobalRegistry, KeyCode, Shortcut } from '@form-created/core'
import {
  ArrayCards,
  ArrayTable,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  ObjectContainer,
  Password,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  Text,
  Form,
  Field,
  Slot,
} from '@form-created/formily-antd'

import { BaseCase } from '../../icons'
import { useMemo } from 'react'
import { saveSchema, setCaseSchema } from '../../service'
import { LogoWidget } from '../../widgets/LogoWidget'
import { ActionsWidget } from '../../widgets/ActionsWidget'
import { CaseDemo } from '../../case'
import { SchemaEditorWidget } from '../../widgets/SchemaEditorWidget'
import { MarkupSchemaWidget } from '../../widgets/MarkupSchemaWidget'
import { PreviewWidget } from '../../widgets/PreviewWidget'
//import { SettingsForm } from '../../component/SettingsForm'
import { SettingsForm } from '@form-created/react-settings-form'

// 注册 自定义的locales
GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
    },
    panels: {
      Case: '案例',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
    panels: {
      Case: 'Case',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Layouts: '레이아웃',
      Arrays: '배열',
      Displays: '디스플레이',
      panels: {},
    },
  },
})
// 注册自定义icon，通过IconWidget组件显示图标
GlobalRegistry.registerDesignerIcons({
  CaseBase: BaseCase,
})

export default function CreateFormView() {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    [],
  )

  return (
    <div className='app-container'>
      <Designer engine={engine} position='relative'>
        <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
          <CompositePanel>
            <CompositePanel.Item title='panels.Component' icon='Component'>
              <ResourceWidget
                title='sources.Inputs'
                sources={[
                  Input,
                  Password,
                  NumberPicker,
                  Rate,
                  Slider,
                  Select,
                  TreeSelect,
                  Cascader,
                  Transfer,
                  Checkbox,
                  Radio,
                  DatePicker,
                  TimePicker,
                  Upload,
                  Switch,
                  ObjectContainer,
                ]}
              />
              <ResourceWidget
                title='sources.Layouts'
                sources={[Card, FormGrid, FormTab, FormLayout, FormCollapse, Space]}
              />
              <ResourceWidget title='sources.Arrays' sources={[ArrayCards, ArrayTable]} />
              <ResourceWidget title='sources.Displays' sources={[Text]} />
              <ResourceWidget title='功能组件' sources={[Slot]} />
            </CompositePanel.Item>
            <CompositePanel.Item title='panels.OutlinedTree' icon='Outline'>
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title='panels.History' icon='History'>
              <HistoryWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title='panels.Case' icon='Case'>
              <CaseWidget
                title='最佳实践'
                cases={CaseDemo}
                onClick={(_, item) => {
                  setCaseSchema(engine, item.schema)
                  setTimeout(() => {
                    console.log(engine.workbench.currentWorkspace.operation)
                    engine.workbench.currentWorkspace.operation.selection.selected = [
                      engine.workbench.currentWorkspace.operation.tree.id,
                    ]
                    //engine.workbench.currentWorkspace.operation.selection.selected = [engine.workbench.currentWorkspace.operation.tree.children[0].id]
                  }, 0)
                }}
              />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id='form'>
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']} />
              </ToolbarPanel>
              <ViewportPanel style={{ height: '100%' }}>
                <ViewPanel type='DESIGNABLE'>
                  {() => (
                    <ComponentTreeWidget
                      components={{
                        Form,
                        Field,
                        Input,
                        Select,
                        TreeSelect,
                        Cascader,
                        Radio,
                        Checkbox,
                        Slider,
                        Rate,
                        NumberPicker,
                        Transfer,
                        Password,
                        DatePicker,
                        TimePicker,
                        Upload,
                        Switch,
                        Text,
                        Card,
                        ArrayCards,
                        ArrayTable,
                        Space,
                        FormTab,
                        FormCollapse,
                        FormGrid,
                        FormLayout,
                        ObjectContainer,
                        Slot,
                      }}
                    />
                  )}
                </ViewPanel>
                <ViewPanel type='JSONTREE' scrollable={false}>
                  {(tree, onChange) => <SchemaEditorWidget tree={tree} onChange={onChange} />}
                </ViewPanel>
                <ViewPanel type='MARKUP' scrollable={false}>
                  {(tree) => <MarkupSchemaWidget tree={tree} />}
                </ViewPanel>
                <ViewPanel type='PREVIEW'>{(tree) => <PreviewWidget tree={tree} />}</ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title='panels.PropertySettings'>
            <SettingsForm uploadAction='https://www.mocky.io/v2/5cc8019d300000980a055e76' />
          </SettingsPanel>
        </StudioPanel>
      </Designer>
    </div>
  )
}
