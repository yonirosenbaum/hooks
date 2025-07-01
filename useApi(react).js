"use client";

import { useState } from "react";
import { useApiStatus } from "src/services/hooks/useApiStatus";
import { LOADING, SUCCESS, ERROR } from "src/services/constants";

export function useApi(fn, config = {}) {
  const { initialData } = config;
  const [data, setData] = useState(initialData);
  const [error, setError] = useState();
  const { apiStatus, setApiStatus, ...normalizedStatuses } = useApiStatus();

  const apiHandler = async (...args) => {
    try {
      setError(null);
      setApiStatus(LOADING);
      const data = await fn(...args);
      setData(data);
      setApiStatus(SUCCESS);
      return {
        data,
        error: null,
      };
    } catch (error) {
      setError(error);
      setApiStatus(ERROR);
      return {
        error,
        data: null,
      };
    }
  };

  return {
    data,
    setData,
    apiStatus,
    setApiStatus,
    error,
    apiHandler,
    ...normalizedStatuses,
  };
}
