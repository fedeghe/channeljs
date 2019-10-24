var Channeljs = (function () {
    'use strict';
    var channels = {},
        findInArray = function (arr, mvar) { return arr.indexOf(mvar); },
        
        Channel = function () {
            this.topic2cbs = {};
            this.lateTopics = {};
            this.enabled = true;
        },
        toggle = function (inst, enabled){
            var changed = inst.enabled
            inst.enabled = enabled;
            return changed !== inst.enabled;
        },
        proto = Channel.prototype;

    /**
     * enable cb execution on publish
     * @return {boolean}
     */
    proto.enable = function () {
        return toggle(this, true);
    };

    /**
     * disable cb execution on publish
     * @return {boolean}
     */
    proto.disable = function () {
        return toggle(this, false);
    };

    /**
     * publish an event on that channel
     * @param  {String} topic
     *                  the topic that must be published
     * @param  {Array} args
     *                 array of arguments that will be passed
     *                 to every callback
     * @return {undefined}
     */
    proto.pub = function (topic, args) {
        var i = 0,
            l,
            res = [];
        if (!(args instanceof Array)) {
            args = [args]
        }
        if (!(topic in this.topic2cbs) || !this.enabled) {
            //save it for late pub, at everysub to this topic
            if (topic in this.lateTopics) {
                this.lateTopics[topic].push({ args: args });
            } else {
                this.lateTopics[topic] = [{ args: args }];
            }
            return null;
        }
        for (l = this.topic2cbs[topic].length; i < l; i += 1) {
            res.push(this.topic2cbs[topic][i].apply(null, args));
        }
        if ('*' in this.topic2cbs) {
            for (i = 0, l = this.topic2cbs['*'].length; i < l; i += 1) {
                res.push(this.topic2cbs['*'][i].apply(null, args));
            }   
        }
        return res;
    };

    /**
     * add a callback to a topic
     * @param {String} topic
     *                 the topic that must be published
     * @param {Function} cb
     *                   the callback will receive as first
     *                   argument the topic, the others follow
     * @return {undefined}
     */
    proto.sub = function (topic, cb, retro) {
        var i = 0,
            l,
            lateRet = [];
        if (!(topic in this.topic2cbs) || !this.enabled) {
            this.topic2cbs[topic] = [];
        }

        this.topic2cbs[topic].push(cb);
        // check lateTopics
        // save it for late pub, at everysub to this topic
        //
        if (retro && topic in this.lateTopics) {
            for (i = 0, l = this.lateTopics[topic].length; i < l; i++) {
                lateRet.push(cb.apply(null, this.lateTopics[topic][i].args));
            }
            return lateRet;
        }
    };

    /**
     * removes an existing booked callback from the topic list
     * @param  {[type]}   topic [description]
     * @param  {Function} cb    [description]
     * @return {[type]}         [description]
     */
    proto.unsub = function (topic, cb) {
        var i = 0;
        if (topic in this.topic2cbs) {
            i = findInArray(this.topic2cbs[topic], cb);
            i >= 0
            && this.topic2cbs[topic].splice(i, 1)
            && (this.topic2cbs[topic].length === 0 && (delete this.topic2cbs[topic]))
        }

        if (topic in this.lateTopics) {
            delete this.lateTopics[topic];
        }
        return this;
    };

    /**
     * one shot sub with auto unsub after first shot
     * @param  {[type]}   topic [description]
     * @param  {Function} cb    [description]
     * @return {[type]}         [description]
     */
    proto.once = function (topic, cb, retro) {
        var self = this;
        function cbTMP() {
            self.unsub(topic, cbTMP);
            return cb.apply(null, Array.prototype.slice.call(arguments, 0));
        };
        return this.sub(topic, cbTMP, retro);
    };

    /**
     * Removes all callbacks for one or more topic
     * @param [String] ...
     *                 the topic queues that must  be emptied
     * @return [Channel] the instance
     */
    proto.reset = function () {
        var ts = Array.prototype.slice.call(arguments, 0),
            l = ts.length,
            i = 0;
        if (!l) {
            this.topic2cbs = {};
            this.lateTopics = {};
            return this;
        }
        for (null; i < l; i += 1) {
            ts[i] in this.topic2cbs && (delete this.topic2cbs[ts[i]]);
            ts[i] in this.lateTopics && (delete this.lateTopics[ts[i]]);
        }
        return this;
    };

    return  {
        getChannels: function (enabledStatus) {
            var ret = {},
                i;
            if (typeof enabledStatus == 'boolean') {
                for (i in channels) {
                    if (channels[i].enabled === enabledStatus) {
                        ret[i] = channels[i]
                    }
                }
            } else {
                ret = channels;
            }
            return ret;
        },
        get: function (name) {
            if (!(name in channels)) {
                channels[name] = new Channel();
            }
            return channels[name];
        }
    };
})();
(typeof exports === 'object') && (module.exports = Channeljs);