import { EventEmitter } from 'events'

import { IEvents } from './interfaces/event.interface'

export class EventBusService {
  constructor(private readonly eventEmitter: EventEmitter) {}

  public subscribe<EventName extends keyof IEvents>(
    eventName: EventName,
    listener: (...args: IEvents[EventName]) => PromiseLike<unknown> | unknown,
    isOnce = false,
  ) {
    this.eventEmitter[isOnce ? 'once' : 'on'](eventName, listener)

    console.debug(
      this.constructor.name,
      `Подписка на событие 🔔 "${eventName}" ${isOnce ? '(одноразовая)' : ''}`,
    )
  }

  public publish<EventName extends keyof IEvents>(
    eventName: EventName,
    ...args: IEvents[EventName]
  ) {
    console.debug(this.constructor.name, `Публикую событие 🔔 "${eventName}"`)

    this.eventEmitter.emit(eventName, args)
  }
}
