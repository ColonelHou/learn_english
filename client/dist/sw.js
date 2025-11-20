const CACHE_NAME = 'english-learning-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('打开缓存');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker 激活');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', event => {
  // 只处理GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // 缓存命中，返回缓存
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        // 检查响应是否有效
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // 克隆响应
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          // 只缓存GET请求且状态为200的响应
          if (event.request.method === 'GET') {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // 网络请求失败，尝试返回缓存
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 如果都没有，返回离线页面
          return caches.match('/');
        });
      });
    })
  );
});
