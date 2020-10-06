import { DocsetEntries } from "docset-tools-types";

/* handler function used to navigate to an HTML file and return associated docset entries */
export interface SelectorHandler {
  (data: BrowserData): Promise<DocsetEntries | void>;
}

/* context object provided to the selector handler */
export interface BrowserData {
  /* return the element attribute as a promise */
  attr: (key: string) => Promise<string>;
  /* return the element attribute as a promise */
  innerText: () => Promise<string>;
  /* return the element outer html as a promise */
  outerHTML: () => Promise<string>;
  /* return a BrowserData representing a `querySelector` value using the current element as the root as a promise */
  single: (selector: string) => Promise<BrowserData>;
  /* return a BrowserData array representing a `querySelectorAll` value using the current element as the root as a promise */
  all: (selector: string) => Promise<BrowserData[]>;
  /* using the selector value, execute the handler function with the selector value and append the items to the entries provided as the 2nd parameter
    and return the aggregated results */
  addTo: (
    selector: SubSelector,
    entries: DocsetEntries
  ) => Promise<DocsetEntries>;
  /* navigate to a new URL */
  goTo: (url: string, waitFor?: string) => Promise<BrowserData>;
}

/* selector data provided to the `addTo` function of `BrowserData` */
export interface SubSelector {
  /* the selector value */
  selector: string;
  /* the handler function provided called for each selector match */
  value: (data: BrowserData) => Promise<DocsetEntries>;
}

/* main selector object provided as the `selectors` options value */
export interface Selector extends SubSelector {
  /* the URL to navigate to */
  url: string;
  /* optional element selector to wait before processing */
  waitFor?: string;
}

export interface HTMLScannerOptions {
  // chrome executable path if using selectors
  chromeExePath?: string;
}
