import { useEffect } from 'react';

function useEffectOnce(fn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}

export default useEffectOnce;
