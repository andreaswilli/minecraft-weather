const TTL = 1000 * 60 * 30; // 30min

export function setCacheItem(key, value, validDuration = TTL) {
  localStorage.setItem(
    key,
    JSON.stringify({ value, validUntil: new Date().getTime() + validDuration })
  );
}

export function getCacheItem(key) {
  const item = JSON.parse(localStorage.getItem(key));

  if (item?.validUntil > new Date()) {
    return item.value;
  }
  return null;
}

export async function withCache(func, key, validDuration = TTL) {
  const cachedItem = getCacheItem(key);

  if (cachedItem) {
    return cachedItem;
  }
  const freshItem = await func();
  setCacheItem(key, freshItem, validDuration);
  return freshItem;
}
