var assert = require('assert'),
    Channeljs = require('../source/');

function getLiteralSize(o) {
    var ret = 0, i;
    for (i in o) ret++;
    return ret;
}
function double(topic, r) { return r * 2; }
function triple(topic, r) { return r * 3; }
function quadruple(topic, r) { return r * 4; }

describe('basic operations', () => {   
    it('should create a channel', () => {
        var c1 = Channeljs.get('one'),
            c2 = Channeljs.get('two');
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(getLiteralSize(c1.topic2cbs), 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(getLiteralSize(c1.lateTopics), 0);
        assert.equal(typeof c1, 'object');
    });

    it('should get all channels', () => {
        var channels = Channeljs.getChannels();
        assert(getLiteralSize(channels), 2)
    });

    it('should attach a subscriber to a topic', () => {
        var c = Channeljs.get('one');
        c.sub('summing', function (topic, a1, a2, a3) {
            return [topic, a1 + a2 + a3];
        });
        c.sub('summing', function (e){return e});
        assert.equal(getLiteralSize(c.topic2cbs), 1);
        assert.equal(c.topic2cbs.summing.length, 2);
    });

    it('should publish on the topic', () => {
        var c = Channeljs.get('one');
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0][0], 'summing');
        assert.equal(results[0][1], 15);
        assert.equal(results[1], 'summing');
    });
});




describe('check enable, disable and reset', () => {
    it('should disable and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        c.disable();
        var allChannels = Channeljs.getChannels(),
            disabledChannels = Channeljs.getChannels(false),
            enabledChannels = Channeljs.getChannels(true);
        assert(getLiteralSize(allChannels), 2)
        assert(getLiteralSize(disabledChannels), 1)
        assert(getLiteralSize(enabledChannels), 1)
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results, null);
    });

    it('shpuld re-enable and check on publish', () => {
        var c = Channeljs.get('one');
        c.enable();
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0][0], 'summing');
        assert.equal(results[0][1], 15);
        assert.equal(results[1], 'summing');
    });

    it('reset all topic on channel and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        c.reset();
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results, null);
    });

    it('add more topics, check with multipub, reset some, recheck', () => {
        var c = Channeljs.get('one');
        c.sub('double', double)
        c.sub('triple', triple)
        c.sub('quadruple', quadruple)
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



    it('should reset', () => {
        var c1 = Channeljs.get('one');
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(getLiteralSize(c1.topic2cbs), 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(getLiteralSize(c1.lateTopics), 0);
        assert.equal(typeof c1, 'object');
    });
});


describe('sub unsub', () => {
    it('should sub once', function () {
        var c = Channeljs.get('one');
        c.once('double', double)
        var results = c.pub('double', [7]);
        assert.equal(results[0], 14)
        c.reset();
    });

    it('should unsub', () => {
        var c = Channeljs.get('one');
        function double(topic, r) { return r * 2; }
        function triple(topic, r) { return r * 3; }
        function quadruple(topic, r) { return r * 4; }
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
    it('should multiple unsub', () => {
        var c = Channeljs.get('one');
        c.pub('double', function (topic) {return topic})
        c.sub('double', double)
        c.sub('triple', triple)
        c.sub('quadruple', quadruple)
        var results = c.pub(['double', 'triple', 'quadruple'], [7]);
        assert.equal(results.length, 3);
        assert.equal(results[0][0], 14);
        assert.equal(results[1][0], 21);
        assert.equal(results[2][0], 28);

        c.unsub(['double', 'triple'], [double, triple]);
        results = c.pub(['double', 'triple', 'quadruple'], [7]);
        assert.equal(results.length, 1);
        assert.equal(results[0][0], 28);

        results = c.pub('triple', [7]);
        assert.equal(results, null);
        c.reset();
    });
    it('should multiple sub', () => {
        var c = Channeljs.get('one');
        
        c.sub(['double', 'triple', 'quadruple'], quadruple)
        var results1 = c.pub('double', [7]),
            results2 = c.pub('triple', [8]),
            results3 = c.pub('quadruple', [9]);
        assert.equal(results1[0], 28);
        assert.equal(results2[0], 32);
        assert.equal(results3[0], 36);
        c.reset();
    });
});

describe('watch out lateTopics', () => {
    it('basic pub and THEN sub should work', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        
        var res = c1.sub('mult', function (topic, a, b, c, d) {
            return a * b * c * d;
        }, true);
        assert.equal(res[0], 120);
        assert.equal(res[1], 840);
        c1.reset();
    });
    it('lateTopic reset', () => {
        var c1 = Channeljs.get('one');
        c1.pub('mult', [2, 3, 4, 5]);
        c1.pub('mult', [4, 5, 6, 7]);
        c1.pub('mult2', [4, 5, 6, 7]);
        function cb(topic, a, b, c, d) {
            return a * b * c * d;
        }
        var res = c1.sub('mult', cb, true);
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
        function cb(topic, a, b, c, d) {
            return a * b * c * d;
        }
        var res = c1.sub('mult', cb, true);
        assert.equal(res[0], 120);
        assert.equal(res[1], 840);
        c1.unsub(['mult'], [cb]);
        c1.reset();
    });
});
