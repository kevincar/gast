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
