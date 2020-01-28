import { Receipt, ReceiptItem } from ".";

export class ReceiptException extends Error {
  constructor(public readonly receipt: Receipt, message: string) {
    super(message);
  }
}

export class ReceiptFormattingException extends ReceiptException {
  constructor(
    public readonly receipt: Receipt,
    public readonly item: ReceiptItem<unknown>,
    message: string
  ) {
    super(receipt, message);
  }
}
