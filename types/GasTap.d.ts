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
     * @returns tapResults
     */
    finish(): tapResults;
}
