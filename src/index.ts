import { Plugin, normalizePath, DocsetEntries } from "docset-tools-types";
import browserSelector from "./browser-selector";
import { Selector } from "./types";
import { existsSync } from "fs-extra";
import copy from "recursive-copy";

const plugin: Plugin = {
  execute: async function ({
    createTmpFolder,
    include,
    pluginOptions,
    cliArgs,
  }) {
    pluginOptions = pluginOptions || {};
    pluginOptions.chromeExePath =
      pluginOptions.chromeExePath || cliArgs.chromeExePath;
    const docsPath = normalizePath(pluginOptions.docsPath) || "docs";
    const docsPathExists = existsSync(docsPath);
    if (!docsPathExists) {
      console.error("docs path does not exist: " + docsPath);
    }

    const rtn: DocsetEntries = pluginOptions.entries || {};

    const tempDir = await createTmpFolder();

    await copy(docsPath, tempDir);

    const selectors: Selector[] = pluginOptions.selectors || [];
    selectors.forEach((selector) => {
      const url =
        "file://" +
        tempDir.startsWith("/" ? tempDir : "/" + tempDir.replace(/\\/g, "/")) +
        selector.url;
      browserSelector(url, selector, pluginOptions);
    });

    Object.values(rtn).forEach((values) => {
      if (typeof values === "object") {
        Object.entries(values).forEach(function ([key, value]) {
          values[key] = "html/" + value;
        });
      }
    });

    await include({
      path: tempDir,
      rootDirName: "html",
    });

    return {
      entries: rtn,
    };
  },
};
export default plugin;
