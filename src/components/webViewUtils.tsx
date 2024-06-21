export const flutterCallHandler = async ({
  handlerName,
  handlerParam = {},
  webViewFun,
  errFun,
}: {
  handlerName: string;
  handlerParam?: unknown;
  webViewFun?: (param?: unknown) => Promise<void>;
  errFun?: () => Promise<void>;
}) => {
  try {
    if (!(window as any)?.flutter_inappwebview) {
      if (webViewFun) {
        await webViewFun(handlerParam);
      }
      throw new Error("no webview");
    } else {
      await (window as any).flutter_inappwebview.callHandler(
        handlerName,
        handlerParam
      );
    }
  } catch (e) {
    if (errFun) {
      await errFun();
    }

    // No Flutter App
  }
};
