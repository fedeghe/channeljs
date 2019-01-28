module.exports = {
    double: function(r) { return r * 2; },
    triple: function(r) { return r * 3; },
    quadruple: function(r) { return r * 4; },
    sum: function() {
        return [].reduce.call(arguments, function (el, acc) {
            return el + acc;
        }, 0)
    },
    mult: function () {
        return [].reduce.call(arguments, function (el, acc) {
            return el * acc;
        }, 1)
    },
    identity: function(e) { return e; }
};
