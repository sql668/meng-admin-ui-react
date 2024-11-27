export const searchFormSchema = {
  form: {
    labelWidth: 80,
    colon: true,
  },
  schema: {
    type: 'object',
    properties: {
      vhrbke1hfq5: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-validator': [],
        'x-component-props': {
          maxColumns: 4,
          minWidth: 300,
          strictAutoFit: true,
        },
        properties: {
          ovj61z83630: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            properties: {
              roleName: {
                type: 'string',
                title: '角色名称',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          r31jkdoirv4: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            properties: {
              status: {
                type: 'string',
                title: '状态',
                enum: [
                  {
                    label: '正常',
                    value: '1',
                  },
                  {
                    label: '停用',
                    value: '0',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              },
            },
          },
          r31jkdoirv5: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            'x-component-props': {
              children: '{{actionSlot}}',
              gridSpan: -1,
              className: 'form-action',
            },
          },
        },
      },
    },
  },
}

export const editFormSchema = {
  form: {
    labelCol: 6,
    wrapperCol: 16,
  },
  schema: {
    type: 'object',
    properties: {
      roleName: {
        type: 'string',
        title: '角色名称',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        'x-designable-id': 'd3hxbd90jz0',
        'x-index': 0,
        name: 'roleName',
        required: true,
      },
      roleCode: {
        type: 'string',
        title: '角色编码',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        'x-designable-id': 'sw4wg6xqthv',
        'x-index': 1,
        name: 'roleCode',
        required: true,
      },
      sort: {
        type: 'number',
        title: '排序',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        'x-designable-id': '40fq251dc6i',
        'x-index': 2,
        name: 'sort',
        default: 1,
      },
      status: {
        type: 'string | number',
        title: '状态',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
          {
            children: [],
            label: '正常',
            value: '1',
          },
          {
            children: [],
            label: '停用',
            value: '0',
          },
        ],
        'x-validator': [],
        'x-component-props': {
          optionType: 'default',
          buttonStyle: 'outline',
        },
        'x-decorator-props': {},
        name: 'status',
        default: '1',
        'x-designable-id': 'jo88x06tzu3',
        'x-index': 3,
      },
      remark: {
        type: 'string',
        title: '备注',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'remark',
        'x-designable-id': 'sf7jijkok7d',
        'x-index': 4,
      },
    },
    'x-designable-id': 'tils69zec7f',
  },
}
