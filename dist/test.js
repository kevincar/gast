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
        if (desc)
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
