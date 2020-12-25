import { Channel } from './channel.interface';

class SubscriptionReceipt {
  readonly id = 0;

  readonly channel: Channel | null = null;

  /**
   * Sets read-only properties id and channel
   *
   * @param {number} id The subscription Id
   * @param {Channel} channel Channel class that issued the subscription receipt
   */
  constructor(id: number, channel: Channel) {
    Object.defineProperties(this, {
      id: {
        value: id,
        enumerable: true,
        configurable: false,
        writable: false,
      },
      channel: {
        value: channel,
        enumerable: true,
        configurable: false,
        writable: false,
      },
    });
  }

  /**
   * @method unsubscribe Unsubscribes from provided key.
   * If no key provided, unsubscribes from every key.
   *
   * @param {string} key Optional parameter, the key to unsubscribe from
   */
  unsubscribe(key?: string): void {
    this.channel?.unsubscribe(this.id, key);
  }
}

export default SubscriptionReceipt;
