import React, { useEffect, useRef, useState } from 'react';


const useHideOnScrollDown = (elem: React.RefObject<HTMLElement>, scrollBox: React.RefObject<HTMLElement>, initalState = true, bottomOffset: number = 0) => {
  const [ scrollDown, setScrollDown ] = useState(initalState);
  const didScroll = useRef(false);

  const element = elem.current;
  let scrollContainer = scrollBox.current;

  let lastScrollTop = scrollContainer ? scrollContainer.scrollTop : 0, // the last scrollY position
  delta = 5,
  elemHeight = element ? element.getBoundingClientRect().height : 0;

  const scrollHandler = () => {
    didScroll.current = true;
  }
  useEffect(() => {
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', scrollHandler);
    }
    return scrollContainer?.removeEventListener("scroll", scrollHandler)
  });


  setInterval(() => {
    if (didScroll) {
      hasScrolled();
      didScroll.current = false;
    }
  }, 250);
  
  function hasScrolled() {
    let st = scrollContainer ? scrollContainer.scrollTop: 0;
    if (Math.abs(lastScrollTop - st) <= delta)
      return;
    /*
    if (st > lastScrollTop && st > elemHeight) {
      setScrollDown(true);
    } else {
      if (st + scrollContainer.innerHeight < document.body.clientHeight) {
        setScrollDown(false);
      }
    }
    */
   if (st > (elemHeight - bottomOffset)) {
      // if (st < lastScrollTop) {
      //   setScrollDown(true);
      // } else
        setScrollDown(false);
    } else {
      setScrollDown(true);
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }

  return [ scrollDown ]
}

export default useHideOnScrollDown;
