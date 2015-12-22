import hooks from 'hooks';

export default function Hooker() {}

for (let k in hooks) {
  Hooker[k] = hooks[k];
}
