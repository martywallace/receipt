import { EOL } from "os";
import { ReceiptFormattingException } from "./exceptions";
import {
  ReceiptOptions,
  ReceiptPropertiesItemOptions,
  ReceiptPropertiesLine,
  ReceiptRulerItemOptions,
  ReceiptTextItemOptions,
  ReceiptItemDataProvider,
  Align,
  Layout
} from "./types";

export * from "./types";

export class ReceiptSupport {
  constructor(protected readonly options: ReceiptOptions) {}

  public toAlignedString(
    value: string,
    align: Align,
    horizontalPadding: number = 0
  ): string {
    const padToken: string = " ";
    const maximumLineLength: number =
      this.options.width - horizontalPadding * 2;

    while (value.length < maximumLineLength) {
      if (align === "left") {
        value = value + padToken;
      } else if (align === "right") {
        value = padToken + value;
      } else {
        value = padToken + value + padToken;
      }
    }

    return value
      .substr(0, maximumLineLength)
      .padStart(this.options.width - horizontalPadding)
      .padEnd(this.options.width);
  }

  public toCurrencyString(base: number): string {
    return (base / 100).toLocaleString(this.options.locale, {
      style: "currency",
      currency: this.options.currency
    });
  }
}

export class Receipt {
  public readonly options: ReceiptOptions;
  public readonly support: ReceiptSupport;
  protected items: readonly ReceiptItem<unknown>[] = [];

  constructor(options: Partial<ReceiptOptions>) {
    this.options = {
      locale: "en-US",
      currency: "USD",
      width: 60,
      ...options
    };

    this.support = new ReceiptSupport(this.options);
  }

  public add(item: ReceiptItem<unknown>): this {
    this.items = this.items.concat(item);
    return this;
  }

  public text(
    text: string | ReceiptItemDataProvider<string>,
    options?: ReceiptTextItemOptions
  ): this {
    return this.add(
      new ReceiptTextItem(
        text instanceof Function ? text(this.support) : text,
        options
      )
    );
  }

  public ruler(options?: ReceiptRulerItemOptions): this {
    return this.add(new ReceiptRulerItem(options));
  }

  public break(): this {
    return this.add(new ReceiptBreakItem());
  }

  public properties(
    lines:
      | readonly ReceiptPropertiesLine[]
      | ReceiptItemDataProvider<readonly ReceiptPropertiesLine[]>,
    options?: ReceiptPropertiesItemOptions
  ): this {
    return this.add(
      new ReceiptPropertiesItem(
        lines instanceof Function ? lines(this.support) : lines,
        options
      )
    );
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
      if (
        line.length + word.length + 1 >
        receipt.options.width - this.options.horizontalPadding * 2
      ) {
        lines.push(line.trim());
        line = "";
      }

      line += word + " ";
    }

    lines.push(line.trim());

    return lines
      .map((line: string) =>
        receipt.support.toAlignedString(
          line,
          this.options.align,
          this.options.horizontalPadding
        )
      )
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

  public getDefaultOptions(): void {}
}

export class ReceiptPropertiesItem extends ReceiptItem<
  ReceiptPropertiesItemOptions
> {
  constructor(
    public readonly lines: readonly ReceiptPropertiesLine[],
    options?: ReceiptPropertiesItemOptions
  ) {
    super(options);
  }

  public format(receipt: Receipt): string {
    const longestLabelWidth: number =
      Math.max(
        ...this.lines.map((line: ReceiptPropertiesLine) => line.label.length)
      ) + this.options.separator.length;

    return this.lines
      .map((line: ReceiptPropertiesLine) =>
        this.options.layout === "align"
          ? (line.label + this.options.separator).padEnd(longestLabelWidth) +
            " " +
            line.value
          : (line.label + this.options.separator).padEnd(
              receipt.options.width - line.value.length
            ) + line.value
      )
      .join(EOL);
  }

  public getDefaultOptions(): ReceiptPropertiesItemOptions {
    return {
      layout: "align",
      separator: ":"
    };
  }
}

export default function create(options: ReceiptOptions): Receipt {
  return new Receipt(options);
}
