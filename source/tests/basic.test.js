var Channeljs = require('../dist'),
    fun = require('./funczs');

describe('basic operations', () => {  
    it('should create some channels', () => {
        var c1 = Channeljs.get('one'),
            c2 = Channeljs.get('two');
        expect(c1.enabled).toBe(true);
        expect(typeof c1.topic2cbs).toBe('object');
        expect(Object.keys(c1.topic2cbs).length).toBe(0);
        expect(typeof c1.lateTopics).toBe('object');
        expect(Object.keys(c1.lateTopics).length).toBe(0);
        expect(typeof c1).toBe('object');
        expect(typeof c2).toBe('object');
    });

    it('should get all channels', () => {
        var channels = Channeljs.getChannels();
        expect(Object.keys(channels).length).toBe(2);
    });

    it('should attach a subscriber to a topic', () => {
        var c1 = Channeljs.get('one');
        c1.sub('summing', fun.sum);
        c1.sub('summing', fun.identity);
        expect(Object.keys(c1.topic2cbs).length).toBe(1);
        expect(c1.topic2cbs.summing.length).toBe(2);
    });

    it('should publish on the topic', () => {
        var c = Channeljs.get('one');
        var results = c.pub('summing', [3, 5, 7]);
        expect(results[0]).toBe(15);
        expect(results[1]).toBe(3);
    });
    
    it('should publish one element as a one element array', () => {
        var c = Channeljs.get('one');
        c.sub('triple', fun.triple);
        var results1 = c.pub('triple', [8]);
            results2 = c.pub('triple', 4);
        expect(results1[0]).toBe(24);
        expect(results2[0]).toBe(12);
    });
    it('should publish on *', () => {
        var c = Channeljs.get('one');
        c.sub('*', fun.quadruple);
        var results1 = c.pub('triple', [8]);
            results2 = c.pub('triple', 4);
        // generic first, then topic specific
        expect(results1[0]).toBe(32);
        expect(results1[1]).toBe(24);
        //same
        expect(results2[0]).toBe(16);
        expect(results2[1]).toBe(12);
    });
});
