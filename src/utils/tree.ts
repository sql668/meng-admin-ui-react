
import { AnyObject } from "./type"

/**
 * 从Array数据构造Tree结构的数据
 * @param data 数组数据
 * @param idField id字段 默认 'id'
 * @param parentIdField parentId字段 默认 'parentId'
 * @param childrenField children字段 默认 'children'
 * @returns
 */
export const buildTreeFromArray = <T extends Record<string, any>>(
  data: Array<T>,
  idField = 'id',
  parentIdField = 'parentId',
  childrenField = 'children',
) => {
  const childrenListMap: Record<string, any> = {}
  const nodeIds: Record<string, any> = {}
  const tree = []
  for (const d of data) {
    const parentId = d[parentIdField]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[idField]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[parentIdField]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[idField]] !== null) {
      o[childrenField] = childrenListMap[o[idField]]
    }
    if (o[childrenField]) {
      for (const c of o[childrenField]) {
        adaptToChildrenList(c)
      }
    }
  }

  return tree
}

/**
 * 得到所有父节点的key，一般用来作为(tree、treeTable)的展开节点
 * @param tree
 * @param keyField
 * @param childrenField
 * @returns
 */
export function getAllExpandKeys<T extends AnyObject>(tree:Array<T>,keyField = 'id',childrenField = 'children') {
  let keys:Array<React.Key> = []
  for (const item of tree) {
    if (item[childrenField] && item[childrenField].length > 0) {
      keys.push(item[keyField])
      keys = keys.concat(getAllExpandKeys(item[childrenField], keyField, childrenField))
    }
  }
  return keys
}

/**
 * 此方法会改变data，需要在使用前cloneDeep
 * @param data
 */
export function treeFlatten<T extends AnyObject>(data: Array<T>, childrenField = 'children') {
  const dataList = []
  for (let i = 0; i < data.length; i++) {
    let node = data[i]
    //const { children, ...rest } = node
    dataList.push(node)
    if (node[childrenField]) {
      treeFlatten(node.children)
      delete node[childrenField]
    }
  }
  return dataList
}

/**
 * 通过key找到父节点
 * @param key
 * @param tree 树data
 * @param keyField key对应的字段 默认 "id"
 * @param childrenField children对应的字段 默认 "children"
 * @returns 父节点｜null
 */
export function getParentNode<T extends AnyObject>(
  key: React.Key,
  tree: T[] = [],
  keyField = 'id',
  childrenField = 'children',
): T|null {
  let parentNode:T | null = null
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node[childrenField]) {
      if (node[childrenField].some((item:T) => item[keyField] === key)) {
        parentNode = node
      } else {
        parentNode = getParentNode(key, node[childrenField], keyField, childrenField)
      }
    }
  }
  return parentNode
}
