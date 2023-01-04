import { EventEmitter } from 'events'

import { EventBusService } from './event-bus.service'

const eventEmitter = new EventEmitter()
const eventBus = new EventBusService(eventEmitter)

export { eventBus, EventBusService as EventBus }
