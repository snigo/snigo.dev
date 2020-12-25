/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/**
 * @function __invokable Returns boolean indicating whether subscription subject is invokable
 *
 * @param {string} key Key to be checked
 */
function __invokable(subscription: Subscription, key: string): boolean {
  return (
    !subscription.done
    && Object.prototype.hasOwnProperty.call(subscription.topic, key)
    && typeof subscription.topic?.[key] === 'function'
  );
}

/**
 * @property {WeakMap<Subscription, boolean>} __done Stores state of the subscriptions
 */
const __done = new WeakMap<Subscription, boolean>();

export type SubscriptionCallback<V = any, T = any> = (v: V, t: T) => void;

export interface SubscriptionTopic {
  [key: string]: SubscriptionCallback;
}

/**
 * @class Subscription initializes new subscription instance, used as a wrapper for topic objects
 * passed with Channel.prototype.subscribe() method
 */
class Subscription {
  readonly topic: SubscriptionTopic | null = null;

  /**
   * Initializes __done Map and sets read-only property subject
   * that will store original subject object
   *
   * @param {SubscriptionTopic} topic Original subject object
   * passed with Channel.prototype.subscribe()
   */
  constructor(topic: SubscriptionTopic) {
    Object.defineProperties(this, {
      topic: {
        value: topic,
        enumerable: true,
        configurable: false,
        writable: false,
      },
    });
    __done.set(this, false);
  }

  /**
   * @property done Returns boolean indicating if subscription is active
   */
  get done(): boolean {
    return !!__done.get(this);
  }

  /**
   * @method next Invokes subscription callback for provided key with given value
   *
   * @param {string} key Key to be updated
   * @param {any} value Value to be passed to callback
   */
  next<V = any, T = any>(key: string, value: V, target: T): void {
    if (__invokable(this, key)) {
      this.topic?.[key](value, target);
    }
  }

  /**
   * @method complete Completes the subscription.
   * Subscription will not be able to pass any values to subscribers
   */
  complete(): void {
    __done.set(this, true);
  }

  /**
   * @method delete Deletes given key from the topic.
   *
   * @param {string} key Key to be removed.
   */
  delete(key: string): boolean {
    if (__invokable(this, key)) {
      delete this.topic?.[key];
      return true;
    }
    return false;
  }
}

export default Subscription;
