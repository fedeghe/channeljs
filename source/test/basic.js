var assert = require('assert'),
    Channeljs = require('../source/');
    fun = require('./funczs');

describe('basic operations', () => {  
    it('should create some channels', () => {
        var c1 = Channeljs.get('one'),
            c2 = Channeljs.get('two');
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(Object.keys(c1.topic2cbs).length, 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(Object.keys(c1.lateTopics).length, 0);
        assert.equal(typeof c1, 'object');
        assert.equal(typeof c2, 'object');
    });

    it('should get all channels', () => {
        var channels = Channeljs.getChannels();
        assert(Object.keys(channels), 2)
    });

    it('should attach a subscriber to a topic', () => {
        var c1 = Channeljs.get('one');
        c1.sub('summing', fun.sum);
        c1.sub('summing', fun.identity);
        assert.equal(Object.keys(c1.topic2cbs).length, 1);
        assert.equal(c1.topic2cbs.summing.length, 2);
    });

    it('should publish on the topic', () => {
        var c = Channeljs.get('one');
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0], 15);
        assert.equal(results[1], 3);
    });
    
    it('should publish one element as a one element array', () => {
        var c = Channeljs.get('one');
        c.sub('triple', fun.triple);
        var results1 = c.pub('triple', [8]);
            results2 = c.pub('triple', 4);
        assert.equal(results1[0], 24);
        assert.equal(results2[0], 12);
    });
    it('should publish on *', () => {
        var c = Channeljs.get('one');
        c.sub('*', fun.quadruple);
        var results1 = c.pub('triple', [8]);
            results2 = c.pub('triple', 4);
        // generic first, then topic specific
        assert.equal(results1[0], 32);
        assert.equal(results1[1], 24);
        //same
        assert.equal(results2[0], 16);
        assert.equal(results2[1], 12);
    });
});
