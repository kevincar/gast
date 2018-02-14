class test {

  private counter: number = 0;
  private succCounter: number = 0;
  private failCounter: number = 0;
  private skipCounter: number = 0;
  private description: string = 'unknown description';

  /***************************************************************
  *
  * T 's functions
  *
  ****************************************************************/

  constructor(desc: string) {
    this.description = desc;
  }

  abstract tapOutput(value: boolean, msg: string): void;

  ok(value: boolean, msg: string): void {
    if (value) {
      this.succCounter++;
      this.tapOutput(true, msg);
    } else {
      this.failCounter++;
      this.tapOutput(false, msg);
    }
  }

  notOk(value: boolean, msg: string): void {
    if (!value) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      this.tapOutput(false, msg)
    }
  }

  equal(v1: boolean, v2: boolean, msg: string): void {
    if (v1 == v2) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s not equal %s', v1, v2)
      this.tapOutput(false, error + ' - ' + msg)
    }
  }

  notEqual(v1: boolean, v2: boolean, msg: string): void {
    if (v1 != v2) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s equal %s', v1, v2)
      this.tapOutput(false, error + ' - ' + msg)
    }
  }

  deepEqual(v1: boolean, v2: boolean, msg: string): void {

    let isDeepEqual: boolean = recursionDeepEqual(v1, v2);

    function recursionDeepEqual(rv1: any, rv2: any): boolean {
      if (!(rv1 instanceof Object) || !(rv2 instanceof Object)) return rv1 == rv2;

      if (Object.keys(rv1).length != Object.keys(rv2).length) return false;

      for (let k: any in rv1) {
        if (!(k in rv2)
            || ((typeof rv1[k]) != (typeof rv2[k]))
        ) return false;

        if (!recursionDeepEqual(rv1[k], rv2[k])) return false;
      }

      return true
    }

    if (isDeepEqual) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s not deepEqual %s', v1, v2)
      this.tapOutput(false, error + ' - ' + msg)
    }
  }

  notDeepEqual(v1, v2, msg) {

    var isNotDeepEqual = recursionNotDeepEqual(v1, v2)

    recursionNotDeepEqual(rv1, rv2) {
      if (!(rv1 instanceof Object) || !(rv2 instanceof Object)) return rv1 != rv2

      if (Object.keys(rv1).length != Object.keys(rv2).length) return true

      for (var k in rv1) {
        if (!(k in rv2)
            || ((typeof rv1[k]) != (typeof rv2[k]))
        ) return true

        if (recursionNotDeepEqual(rv1[k], rv2[k])) return true
      }

      return false
    }

    if (isNotDeepEqual) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s notDeepEqual %s', v1, v2)
      this.tapOutput(false, error + ' - ' + msg)
    }
  }

  nan(v1, msg) {
    if (v1 !== v1) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s not is NaN', v1);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  notNan(v1, msg) {
    if (!(v1 !== v1)) {
      this.succCounter++;
      this.tapOutput(true, msg)
    } else {
      this.failCounter++;
      var error = Utilities.formatString('%s is NaN', v1);
      this.tapOutput(false, error + ' - ' + msg);
    }
  }

  throws(fn, msg) {
    try {
      fn()

      this.failCounter++;
      this.tapOutput(false, 'exception wanted - ' + msg)
    } catch (e) {
      this.succCounter++;
      this.tapOutput(true, msg)
    }
  }

  notThrow(fn, msg) {
    try {
      fn()

      this.succCounter++;
      this.tapOutput(true, msg)
    } catch (e) {
      this.failCounter++;
      this.tapOutput(false, 'unexpected exception:' + e.message + ' - ' + msg)
    }
  }

  skip(msg) {
    this.skipCounter++;
    this.tapOutput(true, msg + ' # SKIP')
    throw EXCEPTION_SKIP
  }

  pass(msg) {
    this.succCounter++;
    this.tapOutput(true, msg + ' # PASS')
    throw EXCEPTION_PASS
  }

  fail(msg) {
    this.failCounter++;
    this.tapOutput(false, msg + ' # FAIL')
    throw EXCEPTION_FAIL
  }

}

class GasTap extends test {

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

  protected EXCEPTION_SKIP: string = 'GasTapSkip';
  protected EXCEPTION_PASS: string = 'GasTapPass';
  protected EXCEPTION_FAIL: string = 'GasTapFail';

  protected totalSucc: number = 0;
  protected totalFail: number = 0;
  protected totalSkip: number = 0;

  constructor(options: IOptions = null) {
    if(options && options.loggerFunc) {
      this.loggerFunc = options.loggerFunc;
    }

    if(typeof(this.loggerFunc) != 'function') throw Error('options.logger must be a function to accept output parameter');

    print('TAP version GasTap v' + this.VERSION + '(BUGGY)')

  }

  // default output to gas logger.log
  protected loggerFunc: loggerFuncType = (msg: string) => { Logger.log(msg) };

  /***************************************************************
  *
  * Instance methods export
  *
  ****************************************************************/

  protected end = this.finish;

  //finish = this.end;

  protected get totalFailed(): number {return this.totalFail;}
  protected totalSucceed(): number {return this.totalSucc;}
  protected totalSkipped(): number {return this.totalSkip;}

  test(description: string, run: runFuncType) {

    let t: test = new test(description);

    try {

      run(this.t);

    } catch ( e /* if e instanceof String */) {
      //      Logger.log('caught exception: ' + e)

      let SKIP_RE: RegExp = new RegExp(this.EXCEPTION_SKIP);
      let PASS_RE: RegExp = new RegExp(this.EXCEPTION_PASS);
      let FAIL_RE: RegExp = new RegExp(this.EXCEPTION_FAIL);

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
      this.totalSucc += this.t.succCounter;
      this.totalFail += this.t.failCounter;
      this.totalSkip += this.t.skipCounter;
    }
  }

  private print(...args: any[]): void {
    let message: string = Utilities.formatString.apply(null, args);

    this.loggerFunc(message);
  }

  private tapOutput(ok: boolean, msg: string) {
    this.print(
      (ok ? 'ok' : 'not ok')
      + ' ' + ++this.t.counter
      + ' - ' + msg
      + ' - ' + this.t.description
    )
  }


  /**
   * Prints a total line to log output. For an example "3 tests, 0 failures"
   *
   * @returns void
   */
  private finish(): void {
    let totalNum: number = this.totalSucc + this.totalFail + this.totalSkip;

    if (totalNum != (this.t.counter)) {
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

interface IOptions {
  loggerFunc: loggerFuncType
}

var GasTap = function (options) {
}
