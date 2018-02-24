var test = (function () {
    /***************************************************************
    *
    * T 's functions
    *
    ****************************************************************/
    function test(desc, tap) {
        this.succCounter = 0;
        this.failCounter = 0;
        this.skipCounter = 0;
        this.description = 'unknown description';
        this.EXCEPTION_SKIP = 'GasTapSkip';
        this.EXCEPTION_PASS = 'GasTapPass';
        this.EXCEPTION_FAIL = 'GasTapFail';
        this.print = null;
        this.description = desc;
        this.print = tap.print.bind(tap);
    }
    test.prototype.tapOutput = function (ok, msg) {
        this.print((ok ? 'ok' : 'not ok')
            + ' ' + ++test.counter
            + ' - ' + msg
            + ' - ' + this.description);
    };
    test.prototype.ok = function (value, msg) {
        if (value) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            this.tapOutput(false, msg);
        }
    };
    test.prototype.notOk = function (value, msg) {
        if (!value) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            this.tapOutput(false, msg);
        }
    };
    test.prototype.equal = function (v1, v2, msg) {
        if (v1 == v2) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s not equal %s', v1, v2);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.notEqual = function (v1, v2, msg) {
        if (v1 != v2) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s equal %s', v1, v2);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.deepEqual = function (v1, v2, msg) {
        var isDeepEqual = recursionDeepEqual(v1, v2);
        function recursionDeepEqual(rv1, rv2) {
            if (!(rv1 instanceof Object) || !(rv2 instanceof Object))
                return rv1 == rv2;
            if (Object.keys(rv1).length != Object.keys(rv2).length)
                return false;
            for (var k in rv1) {
                if (!(k in rv2)
                    || ((typeof rv1[k]) != (typeof rv2[k])))
                    return false;
                if (!recursionDeepEqual(rv1[k], rv2[k]))
                    return false;
            }
            return true;
        }
        if (isDeepEqual) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s not deepEqual %s', v1, v2);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.notDeepEqual = function (v1, v2, msg) {
        var isNotDeepEqual = recursionNotDeepEqual(v1, v2);
        function recursionNotDeepEqual(rv1, rv2) {
            if (!(rv1 instanceof Object) || !(rv2 instanceof Object))
                return rv1 != rv2;
            if (Object.keys(rv1).length != Object.keys(rv2).length)
                return true;
            for (var k in rv1) {
                if (!(k in rv2)
                    || ((typeof rv1[k]) != (typeof rv2[k])))
                    return true;
                if (recursionNotDeepEqual(rv1[k], rv2[k]))
                    return true;
            }
            return false;
        }
        if (isNotDeepEqual) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s notDeepEqual %s', v1, v2);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.nan = function (v1, msg) {
        if (v1 !== v1) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s not is NaN', v1);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.notNan = function (v1, msg) {
        if (!(v1 !== v1)) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        else {
            this.failCounter++;
            var error = Utilities.formatString('%s is NaN', v1);
            this.tapOutput(false, error + ' - ' + msg);
        }
    };
    test.prototype.throws = function (fn, msg) {
        try {
            fn();
            this.failCounter++;
            this.tapOutput(false, 'exception wanted - ' + msg);
        }
        catch (e) {
            this.succCounter++;
            this.tapOutput(true, msg);
        }
    };
    test.prototype.notThrow = function (fn, msg) {
        try {
            fn();
            this.succCounter++;
            this.tapOutput(true, msg);
        }
        catch (e) {
            this.failCounter++;
            this.tapOutput(false, 'unexpected exception:' + e.message + ' - ' + msg);
        }
    };
    test.prototype.skip = function (msg) {
        this.skipCounter++;
        this.tapOutput(true, msg + ' # SKIP');
        throw this.EXCEPTION_SKIP;
    };
    test.prototype.pass = function (msg) {
        this.succCounter++;
        this.tapOutput(true, msg + ' # PASS');
        throw this.EXCEPTION_PASS;
    };
    test.prototype.fail = function (msg) {
        this.failCounter++;
        this.tapOutput(false, msg + ' # FAIL');
        throw this.EXCEPTION_FAIL;
    };
    test.prototype.reset = function () {
        this.succCounter = this.failCounter = this.skipCounter = 0;
        this.description = 'unknown';
    };
    test.counter = 0;
    return test;
}());
var GasTap = (function () {
    function GasTap(options) {
        if (options === void 0) { options = null; }
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
        this.VERSION = '0.2.0';
        this.totalSucc = 0;
        this.totalFail = 0;
        this.totalSkip = 0;
        if (options && options.loggerFunc) {
            this.loggerFunc = options.loggerFunc;
        }
        if (typeof (this.loggerFunc) != 'function')
            throw Error('options.logger must be a function to accept output parameter');
        this.print('TAP version GasTap v' + this.VERSION + '(BUGGY)');
    }
    // default output to gas logger.log
    GasTap.prototype.loggerFunc = function (msg) {
        Logger.log(msg);
    };
    ;
    Object.defineProperty(GasTap.prototype, "totalFailed", {
        /***************************************************************
        *
        * Instance methods export
        *
        ****************************************************************/
        get: function () { return this.totalFail; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GasTap.prototype, "totalSucceed", {
        get: function () { return this.totalSucc; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GasTap.prototype, "totalSkipped", {
        get: function () { return this.totalSkip; },
        enumerable: true,
        configurable: true
    });
    GasTap.prototype.test = function (description, run) {
        var t = new test(description, this);
        try {
            run(t);
        }
        catch (e /* if e instanceof String */) {
            //      Logger.log('caught exception: ' + e)
            var SKIP_RE = new RegExp(t.EXCEPTION_SKIP);
            var PASS_RE = new RegExp(t.EXCEPTION_PASS);
            var FAIL_RE = new RegExp(t.EXCEPTION_FAIL);
            switch (true) {
                case SKIP_RE.test(e):
                case PASS_RE.test(e):
                case FAIL_RE.test(e):
                    break;
                default:
                    if (e instanceof Error)
                        Logger.log('Stack:\n' + e.stack);
                    throw e;
            }
        }
        finally {
            this.totalSucc += t.succCounter;
            this.totalFail += t.failCounter;
            this.totalSkip += t.skipCounter;
        }
    };
    GasTap.prototype.print = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = Utilities.formatString.apply(null, args);
        this.loggerFunc(message);
    };
    /**
     * Prints a total line to log output. For an example "3 tests, 0 failures"
     *
     * @returns void
     */
    GasTap.prototype.finish = function () {
        var totalNum = this.totalSucc + this.totalFail + this.totalSkip;
        if (totalNum != (test.counter)) {
            throw Error('test counting error!');
        }
        var msg = Utilities.formatString('%s..%s', Math.floor(totalNum) > 0 ? 1 : 0, Math.floor(totalNum));
        this.print(msg);
        msg = Utilities.formatString('%s tests, %s failures', Math.floor(totalNum), Math.floor(this.totalFail));
        if (this.totalSkip > 0) {
            msg += ', ' + Math.floor(this.totalSkip) + ' skipped';
        }
        this.print(msg);
    };
    return GasTap;
}());
