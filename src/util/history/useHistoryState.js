import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import history from 'util/history/BrowserHistory';

const useHistoryState = (key, initialState) => {
  // const history = useHistory();
  const stateValue = history.location.state?.[key];

  const [historyState, setHistoryState] = useState(
    stateValue === undefined ? initialState : stateValue
  );

  const setState = useCallback((state, replace = false) => {
      const value = state instanceof Function ? state(historyState) : state;

      setHistoryState(() => value);
      history.replace({
        state: replace ? value : { ...history.location.state, [key]: value }
      });
    }, [history, historyState, key]);

  return [historyState, setState];
};

export default useHistoryState;