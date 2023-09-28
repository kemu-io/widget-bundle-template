/** describes the internal state of this widget */
export type MyCustomWidgetState = {
  value: number;
  /** 
   * private variables start with '$$' and are removed when the widget is duplicated or the recipe is saved 
   **/
  $$private: {
    initialized: boolean;
    value1: number;
    value2: number;
  }
}
