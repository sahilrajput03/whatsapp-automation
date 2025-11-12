# Learn `whatsapp-web.js`

**❤️❤️TODO: Checkout alternates:**
1. [github.com/open-wa/wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs) 3.4k* (134 Issues)
2. [github.com/devlikeapro/waha](https://github.com/devlikeapro/waha) 5.3k* (294 Issues)

**❤️❤️For whatsapp UI:**
- **chatwoot:** [github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)
  - Open-source live-chat, email support, omni-channel desk. An alternative to Intercom, Zendesk, Salesforce Service Cloud etc. 🔥💬

**_🚀✅NOTE: I successfully saved session to mongodb following docs of wweb.js and it works good - though its of no use for me because the session can only be used on one system at a time._**

**Quick Links:**

- Inspiration: https://youtu.be/iovH8bwSCWY
- Docs:
  - Get started: https://wwebjs.dev/guide/
  - Github: https://github.com/pedroslopez/whatsapp-web.js
  - API Docs: https://docs.wwebjs.dev/index.html

# Hosting on linode

- Issue of whatsappweb.js fixed on archlinux on linode server via: `sudo pacman -S chromium`. [TESTED].
- Ram Usage: **330 mb**

How did I finally able to login?

1. I stopped all pm2 apps via `pm2 stop all`.
2. I used to used `Glist` (a web based cli) from linode's server to scan the qr.

It succeeded! 🚀

# Using pm2

```sh
# Create pm2 app
pm2 start nodemon --name tfbr -- tfbr-v2.js
```
