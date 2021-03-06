import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

// Slomux - реализация Flux, в которой, как следует из названия, что-то сломано.
// Нужно починить то, что сломано
// ВНИМАНИЕ! Замена slomux на готовое решение не является решением задачи

const createStore = (reducer, initialState) => {
  let currentState = initialState;
  let listeners = [];

  const getState = () => currentState;
  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => listeners.push(listener);

  return { getState, dispatch, subscribe };
};

const useSelector = (selector) => {
  const ctx = React.useContext(React.createContext(null));
  if (!ctx) {
    return 0;
  }

  return selector(ctx.store.getState());
};
const useDispatch = () => {
  const ctx = React.useContext(React.createContext(null));
  if (!ctx) {
    return () => {};
  }

  return ctx.store.dispatch;
};

const Provider = ({ store, context, children }) => {
  const Context = context || React.createContext(null);

  return <Context.Provider value={{ store }}>{children}</Context.Provider>;
};

// APP

// actions
const UPDATE_COUNTER = "UPDATE_COUNTER";
const CHANGE_STEP_SIZE = "CHANGE_STEP_SIZE";

// action creators
const updateCounter = (value) => ({
  type: UPDATE_COUNTER,
  payload: value
});

const changeStepSize = (value) => ({
  type: CHANGE_STEP_SIZE,
  payload: value
});

// reducers
const defaultState = {
  counter: 1,
  stepSize: 1
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_COUNTER:
      state.counter += action.payload;
      break;
    case CHANGE_STEP_SIZE:
      state.stepSize = action.payload;
      break;
    default:
      return state;
  }
};

// ВНИМАНИЕ! Использование собственной реализации useSelector и dispatch обязательно
const Counter = () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(updateCounter(-1))}>-</button>
      <span> {counter} </span>
      <button onClick={() => dispatch(updateCounter(1))}>+</button>
    </div>
  );
};

const Step = () => {
  const stepSize = useSelector((state) => state.stepSize);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        Значение счётчика должно увеличиваться или уменьшаться на заданную
        величину шага
      </div>
      <div>Текущая величина шага: {stepSize}</div>
      <input
        type="range"
        min="1"
        max="5"
        value={stepSize}
        onChange={({ target }) => dispatch(changeStepSize(target.value))}
      />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider store={createStore(reducer, defaultState)}>
      <Step />
      <Counter />
    </Provider>
  </StrictMode>,
  rootElement
);
