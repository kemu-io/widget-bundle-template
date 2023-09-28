/**
 * Description:  This is a sample Widget Bundle processor, it takes two values,
 * adds them up and sends the result to the next widget.
 */

import {
  DataType,
  GetInputNamesFunction,
  GetOutputNamesFunction,
  InitializeFunction,
  KemuWidget,
  OnParentEventFunction,
  TerminateFunction,
} from './types/kemuCore';
import { MyCustomWidgetState } from './types';


const getInputNames: GetInputNamesFunction = () => [
  { name: 'value1', type: DataType.Number },
  { name: 'value2', type: DataType.Number },
]

const getOutputNames: GetOutputNamesFunction = () => [
  { name: 'total', type: DataType.Number },
]

const initialize: InitializeFunction<MyCustomWidgetState> = async (context) => {
  console.log(`Initializing: ${context.cacheLocation}`);
  const state = context.getState();

  context.setState({
    ...state,
    $$private: {
      initialized: true,
      value1: 0,
      value2: 0,
    },
  });
}

const onParentEvent: OnParentEventFunction<MyCustomWidgetState> = async (event, context) => {
  const state = {
    ...context.getState(),
  }

  const { initialized } = state.$$private;
  const eventValue = event.data.value;
  const eventType = event.data.type;

  if (!initialized) {
    console.log('Widget not initialized');
    return;
  }

  if (eventType === DataType.Number) {
    if (event.targetPort === 'value1') {
      state.$$private.value1 = eventValue as number;
    }

    if (event.targetPort === 'value2') {
      state.$$private.value2 = eventValue as number;
    }

    // Save changes to the state
    context.setState(state);

    return context.nextWidget('total', {
      type: DataType.Number,
      value: state.$$private.value1 + state.$$private.value2,
    });
  }
}


const terminate: TerminateFunction<MyCustomWidgetState> = async (context) => {
  console.log(`Terminating: ${context.getState()}`)
}

export const Widget: KemuWidget = {
  initialize,
  terminate,
  onParentEvent,
  getInputNames,
  getOutputNames,
}