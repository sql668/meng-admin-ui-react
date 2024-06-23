import { depsEqual } from '@/utils/depsEqual';
import * as React from 'react';
import { DependencyList } from 'react';

interface Cache<Value, Condition> {
  condition?: Condition;
  value?: Value;
}

export default function useMemo<Value, Condition = DependencyList>(
  getValue: () => Value,
  condition: Condition,
  shouldUpdate?: (prev: Condition, next: Condition) => boolean,
) {
  const cacheRef = React.useRef<Cache<Value, Condition>>({});

  if (!shouldUpdate) {
    shouldUpdate = (pre: Condition, next: Condition) => {
      return !depsEqual(pre as any, next as any)
    }
  }

  if (
    !('value' in cacheRef.current) ||
    shouldUpdate(cacheRef.current.condition!, condition)
  ) {
    cacheRef.current.value = getValue();
    cacheRef.current.condition = condition;
  }

  return cacheRef.current.value!;
}

export { useMemo as useDeepMemo}
