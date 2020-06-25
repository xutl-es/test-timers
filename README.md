# @xutl/timers

One [eXtremely Useful Tool Library](https://xutl.es) useful for testing, when timers should be intercepted and manually advanced. This also overrides Date to always be in accord with what the time should be according to this library

## Install

```bash
npm install --save-dev @xutl/timers
```

## Usage

Load and initialize the global environmet.

```bash
node -r @xutl/timers my-test.js
```

```typescript
import * as Timer from '@xutl/queue';

// the exported set/clear functions are the original ones that work of system timing;
// Date is also overriden with the original exported

Date.now(); // initially this will be accurate
Timers.initialize(Date.now() - 5000); // set the current time back by 5 seconds, after which Date.now() will lag
Timer.setInterval(() => Timer.bump(5), 10); // bump the time every 10ms by 9ms (which could)
Timer.setinterval(() => Timer.update(Date.now()), 5000); // bring the time up to reality every 5seconds

Date.now(); // will be lagged
setInterval(() => console.log(Date.now()));
/*
Date.now() will initally be lagged,
but after 5seconds it will be up to speed;
just to slowly fall behind again;
but then be brought current again.
*/
```

## License

Copyright 2019,2020 xutl.es

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
