# Learn `whatsapp-web.js`

**Quick Links:**

- Inspiration: https://youtu.be/iovH8bwSCWY
- Docs:
  - Get started: https://wwebjs.dev/guide/
  - Github: https://github.com/pedroslopez/whatsapp-web.js
  - API Docs: https://docs.wwebjs.dev/index.html

# Hosting on linode

- Ram Computation: **330 mb**

How did I finally able to login?

1. I stopped all pm2 apps via `pm2 stop all`.
2. I used to used `Glist` (a web based cli) from linode's server to scan the qr.

It succeeded! 🚀

# Using pm2

```sh
# Create pm2 app
pm2 start nodemon --name tfbr -- tfbr-v2.js
```
