var assert = require('assert'),
    Channeljs = require('../source/');
    fun = require('./funczs');

describe('check enable, disable and reset', () => {

    it('should disable and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        c.sub('summing', fun.sum)
        c.disable();

        var allChannels = Channeljs.getChannels(),
            disabledChannels = Channeljs.getChannels(false),
            enabledChannels = Channeljs.getChannels(true),
            results = c.pub('summing', [3, 5, 7]);

        assert.equal(Object.keys(allChannels).length, 2)
        assert.equal(Object.keys(disabledChannels).length, 1)
        assert.equal(Object.keys(enabledChannels).length, 1)
        assert.equal(results, null);
    });

    it('should re-enable and check on publish', () => {
        var c = Channeljs.get('one');
        c.enable();
        var results = c.pub('summing', [3, 5, 7]);
        assert.equal(results[0], 15);
    });

    it('reset all topic on channel and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        c.reset();
        var results = c.pub('summing', [3, 5, 7]);
        c.unsub('summing');
        assert.equal(results, null);
    });

    it('should reset', () => {
        var c1 = Channeljs.get('one');
        c1.reset();
        assert.equal(c1.enabled, true);
        assert.equal(typeof c1.topic2cbs, 'object');
        assert.equal(Object.keys(c1.topic2cbs).length, 0);
        assert.equal(typeof c1.lateTopics, 'object');
        assert.equal(Object.keys(c1.lateTopics).length, 0);
        assert.equal(typeof c1, 'object');
    });
});
