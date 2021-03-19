import React from 'react';
import { RecoilRoot, atom, useRecoilValue, useSetRecoilState } from '.';
import { useRecoilState } from './useRecoilState';

const listState = atom<string[]>({
  key: 'listState',
  default: [],
});

const inputState = atom({
  key: 'inputState',
  default: 'fuck',
});

const List = () => {
  console.log('list');
  const list = useRecoilValue(listState);

  return (
    <ul>
      {
        list.map((item, index) => {
          return (
            <li key={index}>
              {item}
            </li>
          );
        })
      }
    </ul>
  );
};

const Button = () => {
  console.log('button');
  const setList = useSetRecoilState(listState);

  return (
    <button onClick={() => setList((list) => [...list, ''])}>
      +
    </button>
  );
};

const Input = () => {
  console.log('input');
  const [value, setValue] = useRecoilState(inputState);
  const setList = useSetRecoilState(listState);

  return (
    <input
      value={value}
      onChange={(e) => {
        setList((list) => [...list, e.target.value]);
        setValue(e.target.value);
      }}
    />
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <List />
      <Button />
      <Input />
    </RecoilRoot>
  );
};

export default App;
