var assert = require('assert'),
    Channeljs = require('../source/'),
    fun = require('./funczs');

describe('watch out lateTopics', () => {

    it('basic pub and THEN sub should work, with retroactive', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        var res = c1.sub('mult', fun.mult, true);
        assert.equal(res[0], 120);
        assert.equal(res[1], 840);
        c1.reset();
    });

    it('basic pub and THEN sub should not work, without retroactive', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        var res = c1.sub('mult', fun.mult);
        assert.equal(res, null);
        c1.reset();
    });

    it('lateTopic reset', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        var res = c1.sub('mult', fun.mult, true);
        assert.equal(res[0], 120);
        assert.equal(res[1], 840);
        c1.reset('mult');
        c1.reset();
    });
    
    it('lateTopic unsub', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        var res = c1.sub('mult', fun.mult, true);
        assert.equal(res[0], 120);
        assert.equal(res[1], 840);
        c1.unsub('mult', fun.mult);
        c1.reset();
    });
});
