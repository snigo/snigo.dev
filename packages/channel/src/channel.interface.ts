/* eslint-disable no-unused-vars */
import SubscriptionReceipt from './receipt';
import { SubscriptionTopic } from './subscription';

export interface Channel {
  subscribe(topic: SubscriptionTopic): SubscriptionReceipt;
  unsubscribe(id: number, key?: string): void;
  push<P = any>(key: string, value: P): Channel;
}
