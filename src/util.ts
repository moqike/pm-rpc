import { v1 as uuidv1 } from 'uuid';
import {
  CallbackFunction,
  RuntimeFunction,
  RPC_ARGUMENT_TYPE,
  RPC_ARG_TYPE_KEY
} from './types';

/**
 * Return the original function with required RPC argument info.
 * @param originFunction original callback function
 */
export const Callback = function(originFunction: any): CallbackFunction {
  const result: CallbackFunction = {
    [RPC_ARG_TYPE_KEY]: RPC_ARGUMENT_TYPE.CALLBACK,
    uuid: uuidv1(),
    _function: originFunction
  };
  return result;
};

/**
 * TODO: Not implemented yet
 * @param originFunction
 */
export const Runtime = function(originFunction: any): RuntimeFunction {
  const result: RuntimeFunction = {
    [RPC_ARG_TYPE_KEY]: RPC_ARGUMENT_TYPE.RUNTIME,
    functionString: originFunction.toString(),
    _function: originFunction
  };
  return result;
};