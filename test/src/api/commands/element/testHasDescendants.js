const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

xdescribe('browser.hasDescendants', function(){

  
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });
    
  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('.hasDescendants', function(done){

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/elements',
      method: 'POST',
      postdata: {
        using: 'xpath',
        value: './descendant::*'
      },
      response: {
        value: [{
          'ELEMENT': '1'
        }]
      }
    }, true);

    this.client.api.hasDescendants('#weblogin', function callback(result){
      assert.strictEqual(result.value, true);
    });
    this.client.start(done);
  });


  it('.hasDescendants - no such element', function(done) {

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      method: 'POST',
      postdata: {
        using: 'css selector',
        value: '#badDriver'
      },
     
      response: {
        status: 0,
        sessionId: '1352110219202',
        value: [{
          ELEMENT: '2'
        }]
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/2/elements',
      method: 'POST',
      postdata: {
        using: 'xpath',
        value: './descendant::*'
      },
  
      response: {
        status: 0,
        value: []
      }
    });

    this.client.api.hasDescendants('#badDriver', function callback(result){
      assert.strictEqual(result.value, false);
    });
    
    this.client.start(done);
  });



  it('.hasDescendants - webdriver protcol', function(done){
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/elements',
        response: {
          value: [{
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }]
        }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/elements',
        response: {
          value: [{
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }]
        }
      }, true);
  
      client.api.hasDescendants('#webdriver', function(result) {
        assert.strictEqual(result.value, true);
      }).hasDescendants('#webdriver', function callback(result){
        assert.strictEqual(result.value, true);
      });
  
      client.start(done);
    });
  });

  it('.hasDescendants - webdriver protcol no such element', function(done){
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/elements',
        response: {
          value: []
        }
      });
  
      client.api.hasDescendants('#webdriver', function(result) {
        assert.strictEqual(result.value, false);
      });
  
      client.start(done);
    });
  });

});