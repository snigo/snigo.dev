/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import SubscriptionReceipt from './receipt';
import Subscription, { SubscriptionTopic } from './subscription';

const withChannel = <T extends { new (...args: any[]): {} }>(constructor: T) => {
  const __ids = new WeakMap<Channel, number>();
  const __topics = new WeakMap<Channel, Map<number, Subscription>>();

  class Channel extends constructor {
    target: Channel;

    constructor(...args: any[]) {
      super(...args);
      this.target = this;
      Object.defineProperties(this, {
        target: {
          value: this,
          enumerable: false,
          configurable: false,
          writable: false,
        },
      });
      __ids.set(this, 1);
      __topics.set(this, new Map());
      return new Proxy(this, {
        set(target: Channel, prop: string, value: any) {
          target.push(prop, value);
          return true;
        },
      });
    }

    subscribe(topic: SubscriptionTopic): SubscriptionReceipt {
      const subscription = new Subscription(topic);

      const id = __ids.get(this.target) || 0;
      const subs = __topics.get(this.target);
      __ids.set(this.target, id + 1);
      subs?.set(id, subscription);
      return new SubscriptionReceipt(id, this.target);
    }

    unsubscribe(id: number, key?: string): void {
      const subs = __topics.get(this.target);

      if (subs?.has(id)) {
        const subscription = subs.get(id);

        if (key && typeof subscription?.delete === 'function') {
          subscription.delete(key);
        }

        if (!key || !Object.keys(subscription?.topic || {}).length) {
          if (typeof subscription?.complete === 'function') subscription.complete();
          subs.delete(id);
        }
      }
    }

    push<P = any>(key: string, value: P) {
      const subs = __topics.get(this.target) || [];
      [...subs].forEach(([, subscription]) => {
        subscription.next(key, value, this);
      });
      (this as any)[key] = value;
      return this;
    }
  }

  return Channel;
};

export default withChannel;
