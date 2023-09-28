/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Describe the shape of objects. Eg:
 * 
 * Given the following object:
 * ```
 * const obj = {
 *  property1: 12, 
 *  property2: 'Hello'
 * };
 * ```
 * 
 * The shape definition would be:
 * ```
 * {
 *   'property1': DataType.Number,
 *   'property2': DataType.String,
 * }
 * 
 * ```
 * Use a JsonPrimitiveFormat (`$$primitive_{x}`) to specify the type of an array of primitive objects.
 * where 'x' is the index in the array the value of the property belongs to. Eg:
 * 
 * An even with `[1, 'hi', {other: 'yes}]`, would produce the following jsonShape:
 * 
 * ```
 * {
 *   '$$primitive_0': DataType.Number,
 *   '$$primitive_1': DataType.String,
 *   '$$primitive_2': DataType.JsonObj,
 * }
 * ```
 * 
 * if no primitive index is specified, the system assumes all the items in the array
 * will have the given primitive type. Eg:
 * 
 * An array of `[1, 2, 3, 4]` should be described as
 * ```
 * {
 *  '$$primitive': DataType.Number
 * }
 * ```
 */
export type JsonTypeShape = {
	[key: string]: DataType;
};

type SetStateFunction<T> = (newState: T) => void;
type GetStateFunction<T> = () => Readonly<T>;

export interface InitializeContext<T=any> {
  cacheLocation: string;
  setState: SetStateFunction<T>;
	getState: GetStateFunction<T>;
}

/** Type passed around between gates and blocks */
export type Data = {
	/** the type of data represented  */
	type: DataType;
	value: SupportedTypes | SupportedTypes[];
	/** original time when the event was first picked up by an input gate. */
	timestamp: number;
}

export type PartialData = Omit<Data, 'timestamp'>;

export interface OnParentEventEvent {
  sourcePort: string;
  targetPort: string;
  data: Data;
}

export type InvokeNextWidgetFunction = (port: string, newValue: PartialData) => Promise<void>;

export interface OnParentEventContext<T> {
  recipeId: string;
  recipeType: string;
  getState: () => Readonly<T>;
  setState: (newState: T) => void;
  /**
   * Sends the given value to the next gate attached as a child
   * @param port is the name of the port to invoke gates from (source port of current gate)
   * @param newValue is whatever raw value to be passed on to the next gate
   */
  nextWidget: InvokeNextWidgetFunction;
}

export interface TerminateContext<T> {
  getState: () => Readonly<T>;
}

export interface GetInputNamesCurrentState {
  name: string;
  description: string;
}

export interface GetInputNamesContext {
  recipePoolId: string;
  recipeType: string;
}

export interface WidgetPort {
  name: string;
  label?: string;
  type: DataType | DataType[];
  jsonShape?: JsonTypeShape;
}

/**
 * Invoked when the widget is added to the LogicMapper or the recipe is opened.
 */
export type InitializeFunction<T> = (context: InitializeContext<T>) => Promise<void>;

/**
 * Invoked when the widget receives an event from a parent widget.
 */
export type OnParentEventFunction<T> = (
  event: OnParentEventEvent,
  context: OnParentEventContext<T>
) => Promise<void>;

/**
 * Invoked when the widget is being removed from the LogicMapper or the recipe is closed.
 */
export type TerminateFunction<T> = (context: TerminateContext<T>) => Promise<void>;

/**
 * Describes the input ports of the widget.
 */
export type GetInputNamesFunction = (
  currentState: GetInputNamesCurrentState,
  context: GetInputNamesContext
) => WidgetPort[];

/**
 * Describes the output ports of the widget.
 */
export type GetOutputNamesFunction = (
  currentState: GetInputNamesCurrentState,
  context: GetInputNamesContext
) => WidgetPort[];

/**
 * Kemu's supported data types.
 */
export const enum DataType {
	Number			=			0,
	String			=			1,
	ArrayBuffer	= 		2,
	Array				=			3,
	Boolean			=			4,
	/** a javascript object */
	JsonObj			=			5,
	/** 
	 * Does not care; mostly used by actions to indicate they accept 
   * anything since they probably won't use the value.
	 **/
	Anything		=			6,
	/** Raw image data, produced in browser environments */
	ImageData		=			7,
	/** Raw audio data fraction */
	AudioBuffer	=			8,
	Rect				=			9,
	Point				=			10,
	ImageBitmap	=			11,
}

export type ImageData = {
	width: number;
	height: number;
	data: Uint8ClampedArray;
}

export type Rect = {
	width: number;
	height: number;
	top: number;
	left: number;
}

export type Point = {
	x: number;
	y: number;
}

export type SupportedTypes = number
| string
| ArrayBuffer
| JsonType
| boolean
| ImageData
| AudioBuffer
| Rect
| Point
| SupportedTypes[]
| ImageBitmap

export type JsonType = {
	[key: string]: SupportedTypes
}

/**
 * Describes the shape of a Widget Bundle processor
 */
export interface KemuWidget<T=any> {
  initialize: InitializeFunction<T>;
  onParentEvent: OnParentEventFunction<T>;
  terminate?: TerminateFunction<T>;
  getInputNames?: GetInputNamesFunction;
  getOutputNames?: GetOutputNamesFunction;
}

