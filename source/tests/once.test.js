var Channeljs = require('../dist'),
    fun = require('./funczs');

describe('one time sub', () => {

    it('should sub once', function () {
        var c = Channeljs.get('one');
        c.once('double', fun.double);
        var results1 = c.pub('double', [7]),
            results2 = c.pub('double', [7]);
        expect(results1[0]).toBe(14);
        expect(results2).toBe(null);
        c.reset();
    });

    it('should sub once, retro only once', function () {
        var c = Channeljs.get('one');
        c.pub('double', [7]);
        var results1 = c.once('double', fun.double, true),
            results2 = c.pub('double', [7]);
        expect(results1[0]).toBe(14);
        expect(results2).toBe(null);
        c.reset();
    });

    it('should sub once, retro inactive', function () {
        var c = Channeljs.get('one');
        c.pub('double', [7]);   
        var results1 = c.once('double', fun.double);
        expect(results1).toBeUndefined();
        c.reset();
    });

});
