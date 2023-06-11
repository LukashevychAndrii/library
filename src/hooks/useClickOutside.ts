import React from "react";

interface params {
  ref: React.RefObject<HTMLElement>;
}

export const useClickOutside = ({ ref }: params) => {
  const [clickedOutside, setClickedOutside] = React.useState(false);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setClickedOutside(true);
      } else {
        setClickedOutside(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return clickedOutside;
};

export default useClickOutside;
