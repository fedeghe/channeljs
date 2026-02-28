var Channeljs = require('../dist'),
    fun = require('./funczs');

describe('check enable, disable and reset', () => {

    it('should disable and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        Channeljs.get('two');
        c.sub('summing', fun.sum)
        c.disable();

        var allChannels = Channeljs.getChannels(),
            disabledChannels = Channeljs.getChannels(false),
            enabledChannels = Channeljs.getChannels(true),
            results = c.pub('summing', [3, 5, 7]);

        expect(Object.keys(allChannels).length).toBe(2);
        expect(Object.keys(disabledChannels).length).toBe(1);
        expect(Object.keys(enabledChannels).length).toBe(1);
        expect(results).toBe(null);
    });

    it('should re-enable and check on publish', () => {
        var c = Channeljs.get('one');
        c.enable();
        var results = c.pub('summing', [3, 5, 7]);
        expect(results[0]).toBe(15);
    });

    it('reset all topic on channel and listen for silence on publish', () => {
        var c = Channeljs.get('one');
        c.reset();
        var results = c.pub('summing', [3, 5, 7]);
        c.unsub('summing');
        expect(results).toBe(null);
    });

    it('should reset', () => {
        var c1 = Channeljs.get('one');
        c1.reset();
        expect(c1.enabled).toBe(true);
        expect(typeof c1.topic2cbs).toBe('object');
        expect(Object.keys(c1.topic2cbs).length).toBe(0);
        expect(typeof c1.lateTopics).toBe('object');
        expect(Object.keys(c1.lateTopics).length).toBe(0);
        expect(typeof c1).toBe('object');
    });
});
