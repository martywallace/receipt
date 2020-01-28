import { ReceiptSupport } from ".";

export type ReceiptOptions = {
  readonly locale: string;
  readonly currency: string;
  readonly width: number;
};

export type ReceiptItemDataProvider<T> = (support: ReceiptSupport) => T;

export type Align = "left" | "right" | "center";
export type Layout = "align" | "spread" | "hug";

export type ReceiptTextItemOptions = {
  readonly align: Align;
  readonly horizontalPadding: number;
};

export type ReceiptRulerItemOptions = {
  readonly pattern: string;
};

export type ReceiptPropertiesLine = {
  readonly label: string;
  readonly value: string;
};

export type ReceiptPropertiesItemOptions = {
  readonly layout: Layout;
  readonly separator: string;
};
