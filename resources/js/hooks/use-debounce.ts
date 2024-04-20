import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setdebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setdebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue];
};
