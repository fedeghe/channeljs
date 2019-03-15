[![Coverage Status](https://coveralls.io/repos/github/fedeghe/channeljs/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/channeljs?branch=master)
[![Build Status](https://travis-ci.org/fedeghe/channeljs.svg?branch=master)](https://travis-ci.org/fedeghe/channeljs)
# Channeljs

Channeljs aims to offer a easy-to-use and flexible Observer pattern implementation.

## install it
```
> npm i @fedeghe/channeljs
```

---

Create a Channel, or get it if already exists.
``` js

const Channel = require('@fedeghe/channeljs');
// The Channel.get function lets You create (or retrieve if elsewhere created)
// an instance of a channel.

// Somewhere, subscribe to the "mult"
// topic of the "math" channel
Channel.get('math').sub('mult', function() {
    var args = [].slice.call(arguments, 0);
    return args.reduce(function(el, acc) {
        return acc * el;
    }, 1);
});
```

then elsewhere

``` js
var mult = Channel.get('math').pub('mult', [2, 3, 5, 7, 11, 13, 17]);
console.log(mult) // 510510
```
so the flow seem to be  
1) **subscribe** to a _topic_ passing as second parameter a function that will receive all parameters passed when publishing, the function will most likely return a result.  
2) get that result calling **publish** to a topic passing all parameters needed for the subscriber to be able to calculate and return the result.  

 ...there is something more:  

3) since there could be more subscribers to the same topic, in that case publish will return an array of results, each one corresponding to the result returned from the relative subscriber (subscription order).

4) it's possible to do the opposite, allowing for example a \`late\` subscriber to be informed at subscription time of a past publishing on a topic.

5) couple of more functions: `once` (sub), `enable`, `disable`, `unsub` (one, more,or all topics) and `reset`
---
---
## Raw Api

Once the script has been imported in the browser, or required in Your script (I assume required as `Channeljs`), there are two static functions available:  


#### Channeljs.getAllChannels
``` js
const myChannels  = Channeljs.getAllChannels({enabledStatus <boolean>});
```
Returns an object literal containing all existing Channels, optionally can be passed a boolean value which enables a filter, when `true` it will return only all enabled Channels, when `false` only disabled ones.  

#### Channeljs.get([name \<string\>])  
``` js
const uxEvents = Channeljs.get('ux');
```
Creates, if not already existing, an instance of Channel indexed as `ux`  and returns it. Now we can use it.

---

## @instance methods

#### pub(topic \<string\>, parameters \<array\> | single parameter)

``` js
uxEvents.pub('cartUpdated', articles)
```  
Publishes parameters on one or more topics. If an array is passed then the subscribing function will receive the content of the array as parameters:
```
ch.sub('topicx', (a, b, c) => { ... })
/* ----> */ 
ch.pub('topicx', [1, 2 ,3])
```  
if instead the second agrument used to invoke the `pub` **is not** an array then the subscriber will receive only that as first arguments, all other will not be passed:
```
ch.sub('topicx', (the_obj) => { ... })
/* ----> */ 
ch.pub('topicx', { name: 'widgzard' })
```

#### sub(topic \<string\>, subscriber \<function\> {, retroActive \<boolean\>})
``` js
uxEvents.sub('cartUpdated', function () {
    var articles = [].slice.call(arguments, 0);
})
```
Registers a listener to a particular _topic_ on the channel; the subscribing function will receive all parameters passed in an array as second parameter at _pub_ call:
``` js
ch.pub('bePolite', ['Hello', 'World', '!'])
...
ch.sub('bePolite', function (a, b, c) {
    console.log(`${a} ${b} ${c}`) // Hello World !
}, true) // true here enables retroActivity
```  
The `retroActive` parameter allows the subcriber to be executed immediately for all relevant past published events.  

#### unsub(topic \<string\>, subscriber \<function\>)
Removes the _subscriber_ from the _topic_

#### once(topic \<string\>, subscriber \<function\> {, retroActive \<boolean\>})
Exactly as `sub` but once, retroactivable.

#### enable()
Enables a channel

#### disable()
Disables a channel

---
    
for the moment .... not to be continued