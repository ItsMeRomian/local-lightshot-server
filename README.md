# Local Lightshot Server

A local server for [lightshot](https://app.prntscr.com/). Made with bun (in 50 lines lol).  
Imitates the `http://upload.prntscr.com/upload/` api


## How to use

- Close the repo and run `docker compose up -d`
- Add the following line to your `hosts` file: (Or use a different way to proxy)

```
127.0.0.1 upload.prntscr.com
```
