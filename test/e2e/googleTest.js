import nightwatch from 'nightwatch';

describe("Google demo test for Mocha", function() {
  const client = nightwatch.initClient({silent: true});
  const browser = client.api();

  this.timeout(1 * 60 * 1000);

  describe("with Nightwatch", () => {
    before(() => {
      browser.perform(() => {
      });
    });

    beforeEach((done) => {
      browser.perform(() => {
      });

      client.start(done);
    });

    it("uses BDD to run the Google simple test", (done) => {
      browser.url('https://www.baidu.com').expect.element('body').to.be.present.before(1000);
      // browser.setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]).pause(1000).assert.containsText('#main', 'Night Watch');
      browser.setValue('input#kw', ['nightwatch', browser.Keys.ENTER]).pause(1000).assert.containsText('#wrapper', 'Night Watch');

      client.start(done);
    });

    afterEach(() => {
      browser.perform(() => {
      });
    });

    after((done) => {
      browser.end(() => {
      });

      client.start(done);
    });
  });
});
