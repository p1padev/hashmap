import HashMap from "./hashmap-class.mjs";

const hashmap = new HashMap();
hashmap.set("John", "Smith");
hashmap.set("Serena", "Smith");
hashmap.set("Lil", "Smith");
hashmap.set("Sofia", "Smith");
hashmap.set("Trevor", "Smith");
console.log(hashmap);
console.log(hashmap.updateCapacity());
