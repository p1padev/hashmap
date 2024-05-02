import Node from "./node.mjs";

class Hashmap {
  constructor() {
    this.buckets = Array.from(new Array(16));
    this.numberOfKeysStored = 0;
    this.loadFactorLimit = 0.75;
  }

  getCapacity() {
    return this.buckets.length;
  }

  getNumberOfKeys() {
    return this.numberOfKeysStored;
  }

  getBucket(hash) {
    return this.buckets[hash % this.buckets.length];
  }

  setBucket(hash, value) {
    this.buckets[hash % this.buckets.length] = value;
  }

  createHash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode =
        (primeNumber * hashCode + key.charCodeAt(i)) % this.buckets.length;
    }

    return hashCode;
  }

  setNode(key, value, isRehashing = false) {
    const hash = this.createHash(key);
    const node = new Node();
    node.key = key;
    node.value = value;
    let bucket = this.getBucket(hash);

    if (!isRehashing) {
      if (
        this.numberOfKeysStored >=
        Math.floor(this.getCapacity() * this.loadFactorLimit)
      ) {
        this.growMap();
      }
    }

    while (bucket != null) {
      if (bucket.key === key) {
        bucket.value = value;
        return this;
      }
      if (bucket.next == null) {
        bucket.next = node;
        if (!isRehashing) {
          this.numberOfKeysStored += 1;
        }
        return this;
      }

      bucket = bucket.next;
    }

    this.setBucket(hash, node);
    if (!isRehashing) {
      this.numberOfKeysStored += 1;
    }
    return this;
  }

  has(key) {
    const hash = this.createHash(key);
    let bucket = this.getBucket(hash);
    while (bucket != null) {
      if (bucket.key === key) {
        return true;
      }
      bucket = bucket.next;
    }

    return false;
  }

  remove(key) {
    const hash = this.createHash(key);
    let bucket = this.getBucket(hash);
    let prev = null;

    while (bucket != null) {
      if (bucket.key === key) {
        if (prev == null) {
          this.setBucket(hash, bucket.next);
        } else {
          prev.next = bucket.next;
        }
        this.numberOfKeysStored -= 1;
        return true;
      }

      prev = bucket;
      bucket = bucket.next;
    }

    return false;
  }

  growMap() {
    const oldEntries = [...this.buckets];
    const newCapacity = this.getCapacity() * 2;

    this.buckets = Array.from(new Array(newCapacity));

    oldEntries.forEach((bucket) => {
      while (bucket != null) {
        this.setNode(bucket.key, bucket.value, true);

        bucket = bucket.next;
      }
    });
  }

  clearMap() {
    this.buckets = Array.from(new Array(16).fill(null));
    this.numberOfKeysStored = 0;
  }

  getKeys() {
    return this.buckets.reduce((acc, bucket) => {
      let current = bucket;
      while (current != null) {
        acc.push(current.key);
        current = current.next;
      }
      return acc;
    }, []);
  }

  getValues() {
    return this.buckets.reduce((acc, bucket) => {
      let current = bucket;
      while (current != null) {
        acc.push(current.value);
        current = current.next;
      }
      return acc;
    }, []);
  }

  getEntries() {
    return this.buckets.reduce((acc, bucket) => {
      let current = bucket;
      while (current != null) {
        acc.push([current.key, current.value]);
        current = current.next;
      }

      return acc;
    }, []);
  }
}
