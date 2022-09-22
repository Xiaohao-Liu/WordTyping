// cache-files.js 提供了 cacheName 和 files
self.importScripts('./cache-files.js')
// 安装钩子，缓存所有文件
self.addEventListener('install', e => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      await cache.addAll(files)
    })()
  )
})
// 代理 fetch, 如果缓存中有则从缓存中取，没有则直接请求
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)))
})
// 在 service worker 激活成功后，检查并删除旧版本
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          // 缓存名称和当前不一致的就是以前的旧版本删除掉
          if (cacheName !== key) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
