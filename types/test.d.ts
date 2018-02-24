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
    constructor(desc: string | null, tap: GasTap);
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
