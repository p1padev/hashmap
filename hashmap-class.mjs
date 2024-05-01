import Node from "./node-class.mjs";

export default class HashMap {
  constructor() {
    this.buckets = Array.from(new Array(16));
    this.capacity = 0;
    this.loadFactor = 0.75;
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

  set(key, value, isRehashing = false) {
    const indexOfBucket = this.createHash(key) % this.buckets.length;
    const node = new Node(key, value);

    if ((this.capacity >= this.loadFactor) & !isRehashing) {
      this.growMap();
    }

    if (this.buckets[indexOfBucket] === undefined) {
      this.buckets[indexOfBucket] = node;
    } else if (this.buckets[indexOfBucket].key === key) {
      this.buckets[indexOfBucket].value = value;
    } else {
      let currentBucket = this.buckets[indexOfBucket];
      while (currentBucket != null) {
        if (currentBucket.next == null) {
          currentBucket.next = node;
          break;
        }
        if (currentBucket.key === key) {
          currentBucket.value = value;
          break;
        }
        currentBucket = currentBucket.next;
      }
    }

    this.updateCapacity();
  }

  get(key) {
    const indexOfBucket = this.createHash(key) % this.buckets.length;
    let bucket = this.buckets[indexOfBucket];

    while (bucket != null) {
      if (bucket.key === key) {
        return bucket.value;
      }
      bucket = bucket.next;
    }

    return null;
  }

  has(key) {
    const newHash = this.createHash(key);
    const indexOfBucket = newHash % this.buckets.length;
    let bucket = this.buckets[indexOfBucket];

    while (bucket != null) {
      if (bucket.key === key) {
        return true;
      }

      bucket = bucket.next;
    }

    return false;
  }

  remove(key) {
    const index = this.createHash(key) % this.buckets.length;
    let current = this.buckets[index];
    let prev = null;

    while (current != null) {
      if (current.key === key) {
        if (prev == null) {
          this.buckets[index] = current.next;
        } else {
          prev.next = current.next;
        }
        this.updateCapacity();
        return true;
      }
      prev = current;
      current = current.next;
    }
    return false;
  }

  length() {
    return this.buckets.reduce((acc, bucket) => {
      if (bucket != undefined) {
        while (bucket !== null) {
          acc += 1;
          bucket = bucket.next;
        }
      }
      return acc;
    }, 0);
  }

  clear() {
    this.buckets = Array.from(new Array(16));
    this.updateCapacity();
  }

  keys() {
    return this.buckets.reduce((acc, bucket) => {
      if (bucket != undefined) {
        while (bucket != null) {
          acc.push(bucket.key);
          bucket = bucket.next;
        }
      }
      return acc;
    }, []);
  }
  values() {
    return this.buckets.reduce((acc, bucket) => {
      if (bucket != undefined) {
        while (bucket != null) {
          acc.push(bucket.value);
          bucket = bucket.next;
        }
      }
      return acc;
    }, []);
  }
  entries() {
    return this.buckets.reduce((acc, bucket) => {
      if (bucket != undefined) {
        while (bucket != null) {
          acc.push([bucket.key, bucket.value]);
          bucket = bucket.next;
        }
      }
      return acc;
    }, []);
  }

  updateCapacity() {
    let totalCount = this.buckets.reduce((acc, bucket) => {
      let currentBucket = bucket;
      while (currentBucket != null) {
        acc += 1;
        currentBucket = currentBucket.next;
      }
      return acc;
    }, 0);

    this.capacity = totalCount / this.buckets.length;
    return this;
  }

  growMap() {
    let oldLength = this.buckets.length;
    let entries = this.entries();
    this.buckets = Array.from(new Array(oldLength * 2));

    entries.forEach(([key, value]) => {
      this.set(key, value, true);
    });

    this.updateCapacity();
  }
}
