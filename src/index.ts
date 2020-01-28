import { EOL } from "os";
import {
  ReceiptOptions,
  ReceiptRulerItemOptions,
  ReceiptTextItemOptions
} from "./types";
import { ReceiptFormattingException } from "./exceptions";

export * from "./types";

export class Receipt {
  public readonly options: ReceiptOptions;
  protected items: readonly ReceiptItem<unknown>[] = [];

  constructor(options: Partial<ReceiptOptions>) {
    this.options = {
      width: 60,
      currency: "USD",
      ...options
    };
  }

  public add(item: ReceiptItem<unknown>): this {
    this.items = this.items.concat(item);
    return this;
  }

  public text(text: string, options?: ReceiptTextItemOptions): this {
    return this.add(new ReceiptTextItem(text, options));
  }

  public ruler(options?: ReceiptRulerItemOptions): this {
    return this.add(new ReceiptRulerItem(options));
  }

  public break(): this {
    return this.add(new ReceiptBreakItem());
  }

  public toString(): string {
    return this.items
      .map((item: ReceiptItem<unknown>) => item.format(this))
      .join(EOL);
  }
}

export abstract class ReceiptItem<O> {
  public readonly options: O;

  constructor(options?: Partial<O>) {
    this.options = { ...this.getDefaultOptions(), ...(options ? options : {}) };
  }

  protected abstract getDefaultOptions(): O;

  public abstract format(receipt: Receipt): string;
}

export class ReceiptTextItem extends ReceiptItem<ReceiptTextItemOptions> {
  constructor(
    protected readonly text: string,
    options?: ReceiptTextItemOptions
  ) {
    super(options);
  }

  public getDefaultOptions(): ReceiptTextItemOptions {
    return {
      align: "center",
      horizontalPadding: 0
    };
  }

  public format(receipt: Receipt): string {
    const padToken: string = " ";
    const maximumLineLength: number =
      receipt.options.width - this.options.horizontalPadding * 2;

    if (this.options.horizontalPadding * 2 + 2 > receipt.options.width) {
      throw new ReceiptFormattingException(
        receipt,
        this,
        "The provided padding does not leave enough space to render text - reduce the padding or increase the total receipt width."
      );
    }

    const words: readonly string[] = this.text.split(/\s+/g);

    let lines: string[] = [];
    let line: string = "";

    for (const word of words) {
      if (line.length + word.length + 1 > maximumLineLength) {
        lines.push(line.trim());
        line = "";
      }

      line += word + " ";
    }

    lines.push(line.trim());

    return lines
      .map((line: string) => {
        while (line.length < maximumLineLength) {
          if (this.options.align === "left") {
            line = line + padToken;
          } else if (this.options.align === "right") {
            line = padToken + line;
          } else {
            line = padToken + line + padToken;
          }
        }

        return line
          .substr(0, maximumLineLength)
          .padStart(receipt.options.width - this.options.horizontalPadding)
          .padEnd(receipt.options.width);
      })
      .join(EOL);
  }
}

export class ReceiptRulerItem extends ReceiptItem<ReceiptRulerItemOptions> {
  public getDefaultOptions(): ReceiptRulerItemOptions {
    return {
      pattern: "="
    };
  }

  public format(receipt: Receipt): string {
    let result: string = "";

    while (result.length < receipt.options.width) {
      result += this.options.pattern;
    }

    return result.substr(0, receipt.options.width);
  }
}

export class ReceiptBreakItem extends ReceiptItem<void> {
  public format(receipt: Receipt): string {
    return "".padStart(receipt.options.width);
  }

  public getDefaultOptions(): void {
    //
  }
}

export default function create(options: ReceiptOptions): Receipt {
  return new Receipt(options);
}
