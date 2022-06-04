# README

## Sending local files

src: https://wwebjs.dev/guide/handling-attachments.html#sending-local-files

```js
const {MessageMedia} = require('whatsapp-web.js')

const media = MessageMedia.fromFilePath('./path/to/image.png')
chat.sendMessage(media)
```

`whatsapp-web.js` - https://github.com/pedroslopez/whatsapp-web.js

API Docs: https://docs.wwebjs.dev/index.html
