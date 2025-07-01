import { useState, useMemo } from "react";
import { INACTIVE, defaultStatuses } from "src/services/constants";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const setActiveStatus = (currentStatus) => {
  const statuses = {};

  for (const status of defaultStatuses) {
    const formattedStatus = capitalize(status.toLowerCase());
    const formattedStatusKey = `is${formattedStatus}`;
    statuses[formattedStatusKey] = status === currentStatus;
  }

  return statuses;
};

export const useApiStatus = (currentStatus = INACTIVE) => {
  const [apiStatus, setApiStatus] = useState(currentStatus);
  const statuses = useMemo(() => setActiveStatus(apiStatus), [apiStatus]);

  return {
    apiStatus,
    setApiStatus,
    ...statuses,
  };
};
