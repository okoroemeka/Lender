import * as redis from 'redis';
import * as util from 'util';
import * as mongoose from 'mongoose';

const redisUrl: string = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

interface options {
  key?: String;
}
/*gives us the flexibility of dynamically using a cache 
where it is neededd instead of having the cache on all queries*/
mongoose.Query.prototype.cache = function(options: options = {}): object {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  // to make sure this action is chainable return this
  return this;
};

mongoose.Query.prototype.exec = async function() {
  console.log('exec function===>>');
  if (!this.useCache) {
    console.log('useCache condition===>>');
    return exec.apply(this, arguments);
  }

  // generate the cache key
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // check if the key exist in cach
  const cachedValue = await client.hget(this.hashKey, key);

  //if true, return it
  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    return Array.isArray(doc) ? doc.map(d => this.model(doc)) : this.model(doc);
  }

  // issue the query and store the data in redis
  const result = await exec.apply(this, arguments);
  const a = client.hset(this.hashKey, key, JSON.stringify(result), 'EXP', 10);
  return result;
};

//Clear the cache
interface clearHash {
  (hashKey: string): Promise<any>;
}

interface clearCache {
  clearHash: clearHash;
}
export const clearCache: clearCache = {
  async clearHash(hashKey): Promise<any> {
    await client.del(hashKey);
  }
};
