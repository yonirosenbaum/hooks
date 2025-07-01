'use client';
import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';
interface UseInfiniteScrollProps {
  callback: () => void;
  reset?: () => void;
  resetCondition?: string;
}
const useInfiniteScroll = ({ callback, reset, resetCondition }: UseInfiniteScrollProps) => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    lastPage: 1,
  });
  const mounted = useRef(true);
  const hasNextPage = pageInfo.page < pageInfo.lastPage;

  const setLastPage = (lastPage: number) => {
    setPageInfo((prevState) => ({ ...prevState, lastPage }));
  };

  const nextPage = () => {
    setPageInfo((prevState) => ({ ...prevState, page: pageInfo.page + 1 }));
  };

  const setCurrentPage = (page: number) => {
    setPageInfo((prevState) => ({ ...prevState, page }));
  };

  const { ref } = useIntersectionObserver({ onChange: nextPage });

  useEffect(() => {
    reset?.();
    if (pageInfo.page === 1 && !mounted.current) {
      callback?.();
    }
    mounted.current = false;
  }, [resetCondition]);

  //don't want it to run twice ie if both searchtext updates and page changes
  useEffect(() => {
    callback?.();
  }, [pageInfo.page]);

  return { ref, hasNextPage, page: pageInfo.page, setLastPage, setCurrentPage };
};
export default useInfiniteScroll;
