import { render, h } from "preact";
import { Preview } from "./Preview";
import { createRenderer } from "./quickjsHelpers";

async function getPreviewResult(lang: string | undefined, content: string) {
  if (lang === 'html+preview') {
    // ok
    return content;
  };
  if (lang === 'tsx+preview') {
    try {
      const transpiled = await transpile(content);
      const renderer = await getRenderer();
      return await renderer.render(transpiled);  
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
    }
  }
  return '';
}

async function start() {
  await ensurePresentation();
  // init once
  updatePreviews();
  setInterval(() => {
    if (!location.pathname.startsWith('/c/')) {
      return;
    }
    updatePreviews();
  }, 1000);

  return;

  async function updatePreviews() {
    const elements = [...document.querySelectorAll('.hljs')] as HTMLDivElement[];
    if (elements.length > 0) {
      await loadTailwind();
    };

    // const elements = [...document.querySelectorAll('pre > code')] as HTMLDivElement[];
    for (const el of elements) {
      handleCodeBlock(el);
    }
    return;
  }

  async function handleCodeBlock(el: HTMLDivElement) {
    const lastHash = el.getAttribute('data-preview-hash');
    const content = (el as HTMLElement).innerText!;
    const currentHash = stringToHash(content);
    if (lastHash === currentHash) return;
    el.setAttribute('data-preview-hash', currentHash);

    const run = async () => {
      const lang = el.className.split(' ').find((className) => className.startsWith('language-'))?.replace('language-', '');
      const result = await getPreviewResult(lang, content);
  
      const codeBlock = el.closest('pre')!;  
      if (!codeBlock.lastElementChild!.classList.contains('preview-root')) {
        const previewElement = document.createElement('div');
        codeBlock.appendChild(previewElement);
      }
      // @ts-ignore
      render(h(Preview, {lang, content: result}), codeBlock,  codeBlock.lastElementChild!);    
    }
    setTimeout(() => {
      const next = el.innerText;
      if (next === content) {
        run();
      }
    }, 1000);
  }
  
  async function ensurePresentation() {
    await new Promise<void>(r => {
      const id = setInterval(() => {
        const presentation = document.querySelector('[role="presentation"]');
        if (presentation) {
          clearInterval(id);
          r();
        }
      }, 500);  
    });
  }
}

start().catch(console.error);

// ----

async function loadTailwind() {
  // @ts-ignore
  await import('./tailwind.prebuilt');
}

function stringToHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(32);
}

let _renderer: Awaited<ReturnType<typeof createRenderer>> | null = null;
async function getRenderer() {
  if (!_renderer) {
    const { default: prebuiltSource } = await import('./gen/prebuilt.js?raw');
    // const { default: headlessuiReact } = await import('./gen/headlessui-react.js?raw');
    const libs = {
      // "@headlessui/react": headlessuiReact,
    }
    _renderer = await createRenderer(prebuiltSource, libs);
  }
  return _renderer;
}

let _ts: typeof import('typescript') | null = null;
async function transpile(code: string) {
  if (!_ts) {
    _ts = await import('typescript');
  }
  return _ts.transpile(code, {
    jsx: _ts.JsxEmit.ReactJSX,
    target: _ts.ScriptTarget.ESNext,
    module: _ts.ModuleKind.ESNext,
  });
  // return _ts;
}

