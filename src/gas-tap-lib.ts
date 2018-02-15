/// <reference path="../node_modules/@types/google-apps-script/google-apps-script.base.d.ts" />

class test {

  static counter: number = 0;
  succCounter: number = 0;
  failCounter: number = 0;
  skipCounter: number = 0;
  description: string = 'unknown description';

  EXCEPTION_SKIP: string = 'GasTapSkip';
  EXCEPTION_PASS: string = 'GasTapPass';
  EXCEPTION_FAIL: string = 'GasTapFail';

  print: printFuncType = null;

  /***************************************************************
  *
  * T 's functions
  *
  ****************************************************************/

  constructor(desc: string, tap: GasTap) {
    this.description = desc;
    this.print = tap.print.bind(tap);
  }

  private tapOutput(ok: boolean, msg: string): void {
      this.print(
          (ok ? 'ok' : 'not ok')
          + ' ' + ++test.counter
          + ' - ' + msg
          + ' - ' + this.description
      );
  }

  ok(value: any, msg: string): void {
    if (value) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      this.tapOutput(false, msg);
    }
  }

  notOk(value: any, msg: string): void {
    if (!value) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      this.tapOutput(false, msg)
    }
  }

  equal(v1: any, v2: any, msg: string): void {
    if (v1 == v2) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s not equal %s', v1, v2);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  notEqual(v1: any, v2: any, msg: string): void {
    if (v1 != v2) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s equal %s', v1, v2);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  deepEqual(v1: any, v2: any, msg: string): void {

    let isDeepEqual: boolean = recursionDeepEqual(v1, v2);

    function recursionDeepEqual(rv1: any, rv2: any): boolean {
      if (!(rv1 instanceof Object) || !(rv2 instanceof Object)) return rv1 == rv2;

      if (Object.keys(rv1).length != Object.keys(rv2).length)
        return false;

      for (let k in rv1) {
        if (
            !(k in rv2)
            || ((typeof rv1[k]) != (typeof rv2[k]))
        ) return false;

        if (!recursionDeepEqual(rv1[k], rv2[k])) return false;
      }

      return true;
    }

    if (isDeepEqual) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s not deepEqual %s', v1, v2);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  notDeepEqual(v1: any, v2: any, msg: string): void {

    let isNotDeepEqual: boolean = recursionNotDeepEqual(v1, v2);

    function recursionNotDeepEqual(rv1: any, rv2: any) {
      if (!(rv1 instanceof Object) || !(rv2 instanceof Object)) return rv1 != rv2;

      if (Object.keys(rv1).length != Object.keys(rv2).length) return true;

      for (let k in rv1) {
        if (!(k in rv2)
            || ((typeof rv1[k]) != (typeof rv2[k]))
        ) return true;

        if (recursionNotDeepEqual(rv1[k], rv2[k])) return true;
      }

      return false;
    }

    if (isNotDeepEqual) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s notDeepEqual %s', v1, v2);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  nan(v1: any, msg: string): void {
    if (v1 !== v1) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s not is NaN', v1);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  notNan(v1: any, msg: string): void {
    if (!(v1 !== v1)) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      let error: string = Utilities.formatString('%s is NaN', v1);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  throws(fn: anyFunc, msg: string): void {
    try {
      fn();

      this.failCounter++;
      this.tapOutput(false, 'exception wanted - ' + msg);
    } catch (e) {
      this.succCounter++;
      this.tapOutput(true, msg);
    }
  }

  notThrow(fn: anyFunc, msg: string): void {
    try {
      fn();

      this.succCounter++;
      this.tapOutput(true, msg);
    } catch (e) {
      this.failCounter++;
      this.tapOutput(false, 'unexpected exception:' + e.message + ' - ' + msg);
    }
  }

  skip(msg: string): void {
    this.skipCounter++;
    this.tapOutput(true, msg + ' # SKIP');
    throw this.EXCEPTION_SKIP;
  }

  pass(msg: string): void {
    this.succCounter++;
    this.tapOutput(true, msg + ' # PASS');
    throw this.EXCEPTION_PASS;
  }

  fail(msg: string): void {
    this.failCounter++;
    this.tapOutput(false, msg + ' # FAIL');
    throw this.EXCEPTION_FAIL;
  }

  reset(): void {
      this.succCounter = this.failCounter = this.skipCounter = 0;
      this.description = 'unknown';
  }

}

class GasTap{

  /**
  *
  * GasT - Google Apps Script Testing-framework
  *
  * GasT is a TAP-compliant testing framework for Google Apps Script.
  * It provides a simple way to verify that the GAS programs you write
  * behave as expected.
  *
  * Github - https://github.com/zixia/gast
  * Test Anything Protocol - http://testanything.org/
  *
  * Issues: https://github.com/zixia/gast/issues
  * Author: Zhuohuan LI <zixia@zixia.net>
  * Date: 2015-11-05
  *
  * Example:
  ```javascript
  if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText())
  } // Class GasTap is ready for use now!

  var test = new GasTap()
  ```
  */

  protected VERSION: string = '0.2.0';

  protected totalSucc: number = 0;
  protected totalFail: number = 0;
  protected totalSkip: number = 0;

  constructor(options: IOptions = null) {
      if(options && options.loggerFunc) {
          this.loggerFunc = options.loggerFunc;
      }

      if(typeof(this.loggerFunc) != 'function') throw Error('options.logger must be a function to accept output parameter');

      this.print('TAP version GasTap v' + this.VERSION + '(BUGGY)');

  }

  // default output to gas logger.log
  private loggerFunc(msg: string) {
      Logger.log(msg)
  };

  /***************************************************************
  *
  * Instance methods export
  *
  ****************************************************************/

  get totalFailed(): number {return this.totalFail;}
  get totalSucceed(): number {return this.totalSucc;}
  get totalSkipped(): number {return this.totalSkip;}

  test(description: string, run: runFuncType) {

    let t: test = new test(description, this);

    try {

      run(t);

    } catch ( e /* if e instanceof String */) {
      //      Logger.log('caught exception: ' + e)

      let SKIP_RE: RegExp = new RegExp(t.EXCEPTION_SKIP);
      let PASS_RE: RegExp = new RegExp(t.EXCEPTION_PASS);
      let FAIL_RE: RegExp = new RegExp(t.EXCEPTION_FAIL);

      switch (true) {
        case SKIP_RE.test(e):
        case PASS_RE.test(e):
        case FAIL_RE.test(e):
          break;
        default:
          if (e instanceof Error) Logger.log('Stack:\n' + e.stack);
          throw e;
      }
    } finally {
      this.totalSucc += t.succCounter;
      this.totalFail += t.failCounter;
      this.totalSkip += t.skipCounter;
    }
  }

  print(...args: any[]): void {
    let message: string = Utilities.formatString.apply(null, args);

    this.loggerFunc(message);
  }


  /**
   * Prints a total line to log output. For an example "3 tests, 0 failures"
   *
   * @returns void
   */
  finish(): void {
    let totalNum: number = this.totalSucc + this.totalFail + this.totalSkip;

    if (totalNum != (test.counter)) {
      throw Error('test counting error!');
    }

    let msg: string = Utilities.formatString('%s..%s'
                                     , Math.floor(totalNum)>0 ? 1 : 0
                                     , Math.floor(totalNum));
    this.print(msg);

    msg = Utilities.formatString('%s tests, %s failures', Math.floor(totalNum), Math.floor(this.totalFail));

    if (this.totalSkip>0) {
      msg += ', ' + Math.floor(this.totalSkip) + ' skipped';
    }

    this.print(msg);
  }
}

type loggerFuncType = (msg: string) => void;
type runFuncType = (t: Object) => void;
type anyFunc = (...args: any[]) => any;
type tapOutputFuncType = (ok: boolean, msg: string) => void;
type printFuncType = (...args: any[]) => void;

interface IOptions {
  loggerFunc: loggerFuncType
}
