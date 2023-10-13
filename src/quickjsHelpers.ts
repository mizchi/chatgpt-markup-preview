import { newQuickJSAsyncWASMModule } from "quickjs-emscripten";

const TextEncoderMock = `
class TextEncoder {
  encode() {
    // mock
  }
}
`;
export async function createRenderer(prebuiltSource: string, libs: { [key: string]: string } = {}) {
  const module = await newQuickJSAsyncWASMModule();
  const runtime = module.newRuntime({});

  let id = 0;
  let currentCode = "";
  runtime.setModuleLoader((url) => {
    if (url === `source${id}`) return currentCode;
    if (libs[url]) return libs[url];
    if (url === "react" || url === 'react-dom' || url === "react/jsx-runtime" || url === "prebuilt") {
      return `${TextEncoderMock}${prebuiltSource}`;
    }
    return "";
  });
  const context = runtime.newContext();

  const consoleObj = context.newObject();
  for (const key of Object.keys(console)) {
    const consoleFunc = context.newFunction(key, (...args: any) => {
      const results: any = [];
      for (const item of args) {
        results.push(context.dump(item));
        item.dispose();
      }
      (console as any)[key](...results);
      // console[key](value);
      // arg.dispose();
    });
    context.setProp(consoleObj, key, consoleFunc);
  }
  context.setProp(context.global, "console", consoleObj);
  context.setProp(context.global, "debug", context.newFunction("debug", (arg: any) => {
    const value = context.dump(arg);
    console.log("[debug]", value);
    arg.dispose();
  }));

  const TMP_OUTPUT_KEY = "__tmp__";
  return {
    dispose() {
      runtime.dispose();
    },
    async render(newCode: string) {
      const TMP_OUTPUT_KEY = "__tmp__";
      const code = buildEvalCode(newCode);
      const handle = await context.evalCodeAsync(code);
      context.unwrapResult(handle);
      const value = context.getProp(context.global, TMP_OUTPUT_KEY);
      const result = context.dump(value);
      value.dispose();
      return result;    
    }
  }

  function buildEvalCode(newCode: string) {
    id++;
    currentCode = newCode;

    let importComponent = `import Component from 'source${id}'`;
    if (currentCode.includes("previewProps")) {
      importComponent = `import Component, { previewProps } from 'source${id}'`;
    }
    const evalCode = `
import { jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "prebuilt";
${importComponent};
globalThis.${TMP_OUTPUT_KEY} = renderToStaticMarkup(jsx(Component, previewProps));
`.trim();
    return evalCode;
  }
}
