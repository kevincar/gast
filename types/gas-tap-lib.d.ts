/// <reference path="../node_modules/@types/google-apps-script/google-apps-script.base.d.ts" />
declare class test {
    static counter: number;
    succCounter: number;
    failCounter: number;
    skipCounter: number;
    description: string;
    EXCEPTION_SKIP: string;
    EXCEPTION_PASS: string;
    EXCEPTION_FAIL: string;
    print: printFuncType;
    /***************************************************************
    *
    * T 's functions
    *
    ****************************************************************/
    constructor(desc: string, tap: GasTap);
    private tapOutput(ok, msg);
    ok(value: any, msg: string): void;
    notOk(value: any, msg: string): void;
    equal(v1: any, v2: any, msg: string): void;
    notEqual(v1: any, v2: any, msg: string): void;
    deepEqual(v1: any, v2: any, msg: string): void;
    notDeepEqual(v1: any, v2: any, msg: string): void;
    nan(v1: any, msg: string): void;
    notNan(v1: any, msg: string): void;
    throws(fn: anyFunc, msg: string): void;
    notThrow(fn: anyFunc, msg: string): void;
    skip(msg: string): void;
    pass(msg: string): void;
    fail(msg: string): void;
    reset(): void;
}
declare class GasTap {
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
    protected VERSION: string;
    protected totalSucc: number;
    protected totalFail: number;
    protected totalSkip: number;
    constructor(options?: IOptions);
    private loggerFunc(msg);
    /***************************************************************
    *
    * Instance methods export
    *
    ****************************************************************/
    readonly totalFailed: number;
    readonly totalSucceed: number;
    readonly totalSkipped: number;
    test(description: string, run: runFuncType): void;
    print(...args: any[]): void;
    /**
     * Prints a total line to log output. For an example "3 tests, 0 failures"
     *
     * @returns void
     */
    finish(): void;
}
declare type loggerFuncType = (msg: string) => void;
declare type runFuncType = (t: Object) => void;
declare type anyFunc = (...args: any[]) => any;
declare type tapOutputFuncType = (ok: boolean, msg: string) => void;
declare type printFuncType = (...args: any[]) => void;
interface IOptions {
    loggerFunc: loggerFuncType;
}
