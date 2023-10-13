import { Ref, useEffect, useRef, useState } from "preact/hooks";
const previewUrl = chrome.runtime.getURL('../pages/preview.html');

const useLoadedIframe = (ref: Ref<HTMLIFrameElement>) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    (async () => {
      // content wind ready
      await new Promise<void>((resolve) => {
        setInterval(() => {
          if (ref.current?.contentWindow) {
            resolve();
          }
        }, 300);
      });
      // accept ready
      await new Promise<void>((resolve) => {
        const listener = (e: MessageEvent) => {
          if (e.data.type === 'preview-ready') {
            resolve();
            window.removeEventListener('message', listener);
          }
        };
        window.addEventListener('message', listener);
      });
      console.log('preview-ready');
      setIframe(ref.current);
    })();
  }, []);
  return iframe;
}

export function IframePreview(props: {lang?: string, content: string}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadedIframe = useLoadedIframe(iframeRef);

  useEffect(() => {
    if (!loadedIframe) return;
    const listener = (e: MessageEvent) => {
      if (e.data.type === 'change-size') {
        console.log('change-size', e.data);
        const iw = e.data.width + 20;
        const ih = e.data.height + 20;
        loadedIframe.style.minWidth = iw + 'px';
        loadedIframe.style.minHeight = ih + 'px';
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  }, [loadedIframe]);
  
  // update preview by change
  useEffect(() => {
    if (!loadedIframe?.contentWindow) return;
    const parentSize = loadedIframe.parentElement!.getBoundingClientRect();
    loadedIframe.style.height = parentSize.height + 20 + 'px';
    loadedIframe.contentWindow.postMessage({
      type: 'preview',
      lang: props.lang,
      html: props.content,
    }, "*");
  }, [props.content, props.lang, loadedIframe]);

  return <div class="h-full w-full">
    <h2>Preview</h2>
    <div class="w-full relative">
      <iframe
        class="w-full"
        ref={iframeRef}
        src={previewUrl} 
        sandbox="allow-scripts allow-popups allow-modals"
      />
    </div>
  </div>;
}
