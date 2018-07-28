import { Value, Change } from "slate";

export interface IWysiwygProps {
  value: Value;
  onChange?: (change: Change) => any;
}
