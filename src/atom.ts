export class AtomNode<T> {
  key: string
  value: T

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: T) {
    this.value = newValue;
  }
}

export interface AtomProps<T> {
  key: string;
  default: T;
}

const atom = <T>(props: AtomProps<T>) => {
  const {
    key,
    default: defaultValue,
  } = props;

  return new AtomNode(key, defaultValue);
}

export default atom;
