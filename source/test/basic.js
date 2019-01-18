var assert = require('assert'),
    Channel = require('../dist/');

function getLiteralSize(o) {
    var ret = 0, i;
    for (i in o) {
        ret++;
    }
    return ret;
}

describe('basic operations', () => {
    
    it('should create a channel', () => {
        var c1 = Channel.get('one'),
            c2 = Channel.get('two');
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(getLiteralSize(c1.topic2cbs), 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(getLiteralSize(c1.lateTopics), 0);
        assert.equal(typeof c1, 'object');
    });

    it('should get all channels', () => {
        var channels = Channel.getChannels();
        assert(getLiteralSize(channels), 2)
    });

    it('should attach a subscriber to a topic', () => {
        var c = Channel.get('one');
        c.sub('summing', function (topic, a1, a2, a3) {
            return [topic, a1 + a2 + a3];
        });
        c.sub('summing', function (e){return e});
        assert.equal(getLiteralSize(c.topic2cbs), 1);
        assert.equal(c.topic2cbs.summing.length, 2);
    });

    it('should publish on the topic', () => {
        var c = Channel.get('one');
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0][0], 'summing');
        assert.equal(results[0][1], 15);
        assert.equal(results[1], 'summing');
    });
});
describe('check enable, disable and reset', () => {
    it('should disable and listen for silence on publish', () => {
        var c = Channel.get('one');
        c.disable();
        var allChannels = Channel.getChannels(),
            disabledChannels = Channel.getChannels(false),
            enabledChannels = Channel.getChannels(true);
        assert(getLiteralSize(allChannels), 2)
        assert(getLiteralSize(disabledChannels), 1)
        assert(getLiteralSize(enabledChannels), 1)
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results, null);
    });

    it('shpuld re-enable and check on publish', () => {
        var c = Channel.get('one');
        c.enable();
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0][0], 'summing');
        assert.equal(results[0][1], 15);
        assert.equal(results[1], 'summing');
    });

    it('reset all topic on channel and listen for silence on publish', () => {
        var c = Channel.get('one');
        c.reset();
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results, null);
    });

    it('add more topics, check with multipub, reset some, recheck', () => {
        var c = Channel.get('one');
        c.sub('double', function (topic, r) { return r * 2;})
        c.sub('triple', function (topic, r) { return r * 3;})
        c.sub('quadruple', function (topic, r) { return r * 4;})
        var results = c.pub(['double', 'triple', 'quadruple'], [7]);
        
        assert.equal(results.length, 3);
        assert.equal(results[0][0], 14);
        assert.equal(results[1][0], 21);
        assert.equal(results[2][0], 28);
        c.reset('triple');
        results = c.pub(['double', 'triple', 'quadruple'], [7]);
        
        assert.equal(results.length, 2);
        assert.equal(results[0].length, 1);
        assert.equal(results[0][0], 14);
        
        assert.equal(results[1].length, 1);
        assert.equal(results[1][0], 28);

        results = c.pub('triple', [7]);
        assert.equal(results, null);
        c.reset();
    });

    it('should sub once', function () {
        var c = Channel.get('one');
        c.once('double', function (topic, r) { return r * 2; })
        var results = c.pub('double', [7]);
        assert.equal(results[0], 14)
        c.reset();
    });

    it('should unsub', () => {
        var c = Channel.get('one');
        function double(topic, r){ return r * 2;}
        function triple(topic, r){ return r * 3;}
        function quadruple(topic, r){ return r * 4;}
        c.sub('double', double)
        c.sub('triple', triple)
        c.sub('quadruple', quadruple)
        var results = c.pub(['double', 'triple', 'quadruple'], [7]);
        assert.equal(results.length, 3);
        assert.equal(results[0][0], 14);
        assert.equal(results[1][0], 21);
        assert.equal(results[2][0], 28);

        c.unsub('triple', triple);
        results = c.pub(['double', 'triple', 'quadruple'], [7]);
        assert.equal(results.length, 2);
        assert.equal(results[0][0], 14);
        assert.equal(results[1][0], 28);
        
        results = c.pub('triple', [7]);
        assert.equal(results, null);
        c.reset();
    });
    it('should reset', () => {
        var c1 = Channel.get('one');
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(getLiteralSize(c1.topic2cbs), 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(getLiteralSize(c1.lateTopics), 0);
        assert.equal(typeof c1, 'object');
    });


});
