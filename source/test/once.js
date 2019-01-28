var assert = require('assert'),
    Channeljs = require('../source/'),
    fun = require('./funczs');

describe('one time sub', () => {

    it('should sub once', function () {
        var c = Channeljs.get('one');
        c.once('double', fun.double);
        var results1 = c.pub('double', [7]),
            results2 = c.pub('double', [7]);
        assert.equal(results1[0], 14);
        assert.equal(results2, null);
        c.reset();
    });

    it('should sub once, retro only once', function () {
        var c = Channeljs.get('one');
        c.pub('double', [7]);
        var results1 = c.once('double', fun.double, true),
            results2 = c.pub('double', [7]);
        assert.equal(results1[0], 14);
        assert.equal(results2, null);
        c.reset();
    });

    it('should sub once, retro inactive', function () {
        var c = Channeljs.get('one');
        c.pub('double', [7]);   
        var results1 = c.once('double', fun.double);
        assert.equal(results1, null);
        c.reset();
    });

});
