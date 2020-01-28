export type ReceiptOptions = {
  readonly currency: string;
  readonly width: number;
};

export type ReceiptTextItemAlign = "left" | "right" | "center";

export type ReceiptTextItemOptions = {
  readonly align: ReceiptTextItemAlign;
  readonly horizontalPadding: number;
};

export type ReceiptRulerItemOptions = {
  readonly pattern: string;
};
