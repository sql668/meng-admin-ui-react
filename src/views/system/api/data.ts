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
              apiGroup: {
                type: 'string',
                title: 'api组',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          r31jkdoirv4: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            properties: {
              path: {
                type: 'string',
                title: 'api路径',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          r31jkdoirv6: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
            properties: {
              method: {
                type: 'string',
                title: 'Method',
                enum: [
                  {
                    label: '查询(GET)',
                    value: 'GET',
                  },
                  {
                    label: '创建(POST)',
                    value: 'POST',
                  },
                  {
                    label: '更新(PUT)',
                    value: 'PUT',
                  },
                  {
                    label: '删除(DELETE)',
                    value: 'DELETE',
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
    labelWidth: 100,
  },
  schema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        title: 'api路径',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'path',
        required: true,
        'x-designable-id': 'm26s0h0guq5',
        'x-index': 0,
      },
      method: {
        title: 'method',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'method',
        required: true,
        enum: [
          {
            children: [],
            label: '创建(POST)',
            value: 'POST',
          },
          {
            children: [],
            label: '更新(PUT)',
            value: 'PUT',
          },
          {
            children: [],
            label: '查询(GET)',
            value: 'GET',
          },
          {
            children: [],
            label: '删除(DELETE)',
            value: 'DELETE',
          },
        ],
        'x-designable-id': 'vi7b7q8js0y',
        'x-index': 1,
      },
      apiGroup: {
        type: 'string',
        title: 'api分组',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'apiGroup',
        required: true,
        'x-designable-id': 'czz3wd6c22g',
        'x-index': 2,
      },
      remark: {
        type: 'string',
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [],
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'remark',
        required: true,
        'x-designable-id': 'm4n5qn2s6co',
        'x-index': 3,
      },
    },
    'x-designable-id': '4n446u6lx3y',
  },
}
