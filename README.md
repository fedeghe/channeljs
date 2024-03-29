[![Coverage Status](https://coveralls.io/repos/github/fedeghe/channeljs/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/channeljs?branch=master)  

# Channeljs

Channeljs aims to offer a isomorphic easy-to-use, small and flexible Observer pattern implementation.

## install it
```
> yarn add @fedeghe/channeljs
```

## run the tests / coverage
```
> yarn test
> yarn cover 
```

---

Create a Channel, or get it if already exists.
``` js

import Channel from '@fedeghe/channeljs'
// import Channel from '@fedeghe/channeljs';

// The Channel.get function lets You create (or retrieve if elsewhere created)
// an instance of a channel.

// Somewhere, subscribe to the "mult"
// topic of the "math" channel
Channel.get('math').sub('mult',
    (...args) => args.reduce((el, acc) => acc * el, 1)
);
```

then elsewhere

``` js
import Channel from '@fedeghe/channeljs'
// ...
const mult = Channel.get('math').pub('mult', [2, 3, 5]);
console.log(mult) // 30
```
so the flow seems to be  
1) **subscribe** to a _topic_ passing as second parameter a function that will receive all parameters passed when publishing, the function could as side effect consume the published data or/and return a result.  
2) get that result calling **publish** to a topic passing all parameters needed for the subscriber to be able to calculate and return the result.  

 ...there is something more:  

3) since there could be more subscribers to the same topic, in that case publish will return an array of results, each one corresponding to the result returned from the relative subscriber (subscription order). There is not realy way to be sure about the result/subscriber correspondance thus it is not a bad idea to include this information in the returned result (as a referrer information).

4) it's possible to do the opposite, allowing for example a \`late\` subscriber to be informed **at subscription time** of a past publishing on a topic.

5) couple of more functions: `once` (sub), `enable`, `disable`, `unsub` (one, more, or all topics) and `reset`
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

<br/>  

### **pub(topic \<string\>, parameters \<array\> | single parameter)**

``` js
uxEvents.pub('cartUpdated', articles)
```  
Publishes parameters on one or more topics. If an array is passed then the subscribing function will receive the content of the array as parameters:
``` js
ch.sub('topicx', (a, b, c) => { ... })
/* ----> */ 
ch.pub('topicx', [1, 2 ,3])
```  
if instead the second agrument used to invoke the `pub` **is not** an array then the subscriber will receive only that as first arguments, all other will not be passed:
``` js
ch.sub('topicx', (the_obj) => { ... })
/* ----> */ 
ch.pub('topicx', { name: 'widgzard' })
```
<br/>  

### **sub(topic \<string\>, subscriber \<function\> {, retroActive \<boolean\>})**
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

<br/>

### **unsub(topic \<string\>, subscriber \<function\>)**
Removes the _subscriber_ from the _topic_

<br/>

### **once(topic \<string\>, subscriber \<function\> {, retroActive \<boolean\>}**  
Exactly as `sub` but once, retroactivable.


<br/>

### **enable()**  
Enables a channel

<br/>

### **disable()**  
Disables a channel
