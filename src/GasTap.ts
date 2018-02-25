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
   * @returns tapResults
   */
  finish(): tapResults {
    let totalNum: number = this.totalSucc + this.totalFail + this.totalSkip;

    let results: tapResults = {
        nTotal: totalNum,
        nFailed: this.totalFail,
        nSkipped: this.totalSkip,
        nSucceeded: this.totalSucc
    };

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

    return results;
  }
}
