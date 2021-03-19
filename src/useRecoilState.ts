import { useEffect, useState } from 'react';
import { AtomNode } from './atom';
import { useStoreRef, Store, Updater } from './RecoilRoot';

let subscriptionId = 0;

const subscribeRecoilState = (
  store: Store,
  atomKey: string,
  subscriptionId: number,
  callback: Updater,
) => {
  const key = `${atomKey}@${subscriptionId}`;

  if (!store.subscriptions.has(atomKey)) {
    store.subscriptions.set(atomKey, new Map());
  }

  if (!store.subscriptions.get(atomKey)?.has(key)) {
    store.subscriptions.get(atomKey)?.set(key, callback);
  }

  return () => {
    store.subscriptions.get(atomKey)?.delete(key);
  };
};

export const useRecoilValue = <T>(atom: AtomNode<T>) => {
  const storeRef = useStoreRef();

  if (!storeRef) {
    throw new Error('useRecoilValue hook must be used in child component of RecoilRoot');
  }

  const {
    current: store,
  } = storeRef;

  const {
    key,
  } = atom;

  const [, setState] = useState({});

  useEffect(() => {
    return subscribeRecoilState(store, key, subscriptionId++, () => {
      setState({});
    });
  }, [store, key]);

  return atom.getValue();
};

export const useSetRecoilState = <T>(atom: AtomNode<T>) => {
  const storeRef = useStoreRef();

  if (!storeRef) {
    throw new Error('useRecoilValue hook must be used in child component of RecoilRoot');
  }

  const {
    current: store,
  } = storeRef;

  const {
    key,
  } = atom;

  const setState = (newValueOrUpdater: ((preValue: T) => T) | T) => {
    let newValue = newValueOrUpdater;

    if (typeof newValueOrUpdater === 'function') {
      newValue = (newValueOrUpdater as (preValue: T) => T)(atom.getValue());
    }

    atom.setValue(newValue as T);
    store.replaceState(key);
  }

  return setState;
};

export const useRecoilState = <T>(atom: AtomNode<T>): [T, (newValueOrUpdater: T | ((preValue: T) => T)) => void] => {
  return [useRecoilValue(atom), useSetRecoilState(atom)];
};
