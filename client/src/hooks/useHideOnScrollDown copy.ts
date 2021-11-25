import React, { useState } from 'react';

type ScrollContainerType = (Window & typeof globalThis);
const useHideOnScrollDown = (elem: React.RefObject<HTMLElement>, scrollContainer: ScrollContainerType =window, initalState = true) => {
  const [ scrollDown, setScrollDown ] = useState(initalState);
  const element = elem.current;
  let didScroll = false,
  lastScrollTop = scrollContainer.pageYOffset || document.documentElement.scrollTop, // the last scrollY position
  delta = 5,
  elemHeight = element ? element.getBoundingClientRect().height : 0;
  // let elemTop = element ? element.getBoundingClientRect().top : 0;

  scrollContainer.addEventListener('scroll', () => {
    didScroll = true;
  });

  setInterval(() => {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);
  
  function hasScrolled() {
    let st = scrollContainer.pageYOffset || document.documentElement.scrollTop;
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
   if (st > elemHeight) {
      if (st < lastScrollTop) {
        setScrollDown(true);
      } else
        setScrollDown(false);
    } else {
      if (st + scrollContainer.innerHeight < document.body.clientHeight) {
        setScrollDown(true);
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }

  return [ scrollDown ]
}

export default useHideOnScrollDown;
