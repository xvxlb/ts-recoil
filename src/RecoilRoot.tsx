import React, { useContext, createContext, useRef, useState, useEffect } from 'react';
import { AtomNode } from './atom';

export interface Updater {
  (): void
}

export interface BatcherProps {
  setNotify: (update: Updater) => void;
}

export interface Store {
  atomValues: Map<string, AtomNode<any>>
  updateAtomKeys: string[];
  replaceState: (key: string) => void;
  subscriptions: Map<string, Map<string, Updater>>;
}

const StoreContext = createContext<React.MutableRefObject<Store> | null>(null);

const useStoreRef = () => useContext(StoreContext);

const Batcher: React.FC<BatcherProps> = (props) => {
  const {
    setNotify,
  } = props;

  const [, setState] = useState({});

  const storeRef = useStoreRef();

  setNotify(() => setState({}));

  useEffect(() => {
    if (!storeRef) {
      return;
    }

    const keys = storeRef.current.updateAtomKeys;

    keys.forEach((key) => {
      storeRef.current.subscriptions.get(key)?.forEach((subscription) => {
        subscription();
      });
    });

    storeRef.current.updateAtomKeys = [];
  })

  return null;
}

const RecoilRoot: React.FC = (props) => {
  const {
    children,
  } = props;

  const notifyUpdate = useRef<Updater>();

  const store = useRef<Store>({
    atomValues: new Map(),
    updateAtomKeys: [],
    replaceState: (key) => {
      if (notifyUpdate.current) {
        notifyUpdate.current();
      }
      store.current.updateAtomKeys.push(key);
    },
    subscriptions: new Map(),
  });

  return (
    <StoreContext.Provider value={store}>
      <Batcher setNotify={(updater) => notifyUpdate.current = updater} />
      {children}
    </StoreContext.Provider>
  );
}

export default RecoilRoot;
export {
  useStoreRef,
}
