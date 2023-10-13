import { newQuickJSAsyncWASMModule } from "quickjs-emscripten";

const TextEncoderMock = `
class TextEncoder {
  encode() {
    // mock
  }
}
`;
export async function createRenderer(prebuiltSource: string) {
  const module = await newQuickJSAsyncWASMModule();
  const runtime = module.newRuntime();

  let id = 0;
  let currentCode = "";
  runtime.setModuleLoader((url) => {
    if (url === `source${id}`) return currentCode;
    if (url === "react" || url === "react/jsx-runtime" || url === "prebuilt") {
      return `${TextEncoderMock}${prebuiltSource}`;
    }
    return "";
  });
  const context = runtime.newContext();
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
    async render(newCode: string, props: any = {}) {
      const TMP_OUTPUT_KEY = "__tmp__";
      const code = buildEvalCode(newCode, props);
      const handle = await context.evalCodeAsync(code);
      context.unwrapResult(handle);
      const value = context.getProp(context.global, TMP_OUTPUT_KEY);
      const result = context.dump(value);
      value.dispose();
      return result;    
    }
  }

  function buildEvalCode(newCode: string, props: any) {
    id++;
    currentCode = newCode;
    const evalCode = `
import { jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "prebuilt";
import Component from "source${id}";
const props = JSON.parse(\`${JSON.stringify(props)}\`);
globalThis.${TMP_OUTPUT_KEY} = renderToStaticMarkup(jsx(Component, props));
`.trim();
    return evalCode;
  }
}
