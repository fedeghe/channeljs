const Channeljs = require('./dist')

const C = Channeljs.get('one');

C.sub('*', (...args) => {
    return args
})
C.sub('doit', (...args) => {
    return args
})

const t = C.pub('doit', [1,2,3,4]);
console.log('t: ', t)
