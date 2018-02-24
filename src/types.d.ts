type loggerFuncType = (msg: string) => void;
type runFuncType = (t: test) => void;
type anyFunc = (...args: any[]) => any;
type tapOutputFuncType = (ok: boolean, msg: string) => void;
type printFuncType = (...args: any[]) => void;

interface IOptions {
  loggerFunc: loggerFuncType
}
