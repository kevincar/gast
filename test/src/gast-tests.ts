/// <reference path="../../types/gas-tap-lib.d.ts" />

/**
*
* Put tests in me, then run me!
*
*/
function gastTestRunner() {
  'use strict'
  /**
  *
  * GasT - Google Apps Script Testing-framework
  *
  * GasT is a TAP-compliant testing framework for Google Apps Script.
  * It provides a simple way to verify that the GAS programs you write
  * behave as expected.
  *
  * Github - https://github.com/zixia/gast
  *
  */


  //////////////////////////////////////////////////////////////////////////////////////////
  ///// GasT include header start

  if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/kevincar/gast/master/dist/gas-tap-lib.js').getContentText())
  } // Class GasTap is ready for use now!

  ///// GasT include header end
  //////////////////////////////////////////////////////////////////////////////////////////


  let tap: GasTap = new GasTap();


  tap.test('TAP ok', function (t: test) {
    t.ok(true, 'true is ok');
    t.notOk(false, 'false is not ok');
  })

  tap.test('TAP equal', function (t: test) {
      t.equal(true, true, 'true equal true');
      t.notEqual(true, false, 'true not equal false');

      t.equal(99, String(99), 'number 99 equal string "99"');

      let a: Object = { x: 3, y: { a: 4, b: 5}, z: [5, 6] };
      let a2: Object = { x: 3, y: { a: 4, b: 5}, z: [5, 6] };
      let b: Object = { a: [3, 4], b: 3, c: {a: 3} };

      t.deepEqual(a, a2, 'a deepEqual a2');
      t.notDeepEqual(a, b, 'a notDeepEqual b');

      t.deepEqual([0], [0], '[0] deepEqual [0]');
      t.notDeepEqual([0], [0], 'this should fail: [0] notDeepEqual [0]');

      t.nan(NaN, 'NaN is NaN');
      t.notNan({}, '{} not is NaN');
  });

  tap.test('TAP exception', function (t: test) {
      t.throws(function () { throw Error('exception') }, 'exception throwed');
      t.notThrow(function () { return }, 'no exception found');
  });

  // tap.test('TAP setPrintDriver', function (t: test) {
  //   t.throws(function () { test.setPrintDriver('unknown') }, 'unknown driver throws exception')
  // })

  tap.test('TAP skip', function (t: test) {
      t.skip('skipped');
      t.fail('skip failed');
  });

  tap.test('TAP pass', function (t: test) {
      t.pass('passed');
  });

  tap.test('TAP fail', function (t: test) {
      t.fail('this should fail')
  });

  tap.test('final Stats test', function (t: test) {
    //GIVEN - this test suite
    let totalFailed: number = 2;
    let totalSucceed: number = 14;
    let totalSkipped: number = 1;

    //WHEN - assuming test order maintenence
    //THEN
    t.equal(tap.totalFailed, totalFailed, "total failed value correct");
    t.equal(tap.totalSucceed, totalSucceed, "total succeed value correct");
    t.equal(tap.totalSkipped, totalSkipped, "total skiped value correct");
  })

  tap.finish();

}
