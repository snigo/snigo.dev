import withChannel from './with-channel';
import Mirror from './mirror';

const channel = <T>(obj: T) => new (withChannel(Mirror))(obj);

export default channel;
