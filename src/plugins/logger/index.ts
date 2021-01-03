import { CreateStoreReturnType, Subscriber, ActionSubscriber } from '../../'
import { clone } from 'ramda'

/**
 * @public
 */
export const defaultCollapsed = true as boolean

/**
 * @public
 */
export function defaultFilter(_mutation: Parameters<Subscriber>['0'], _prevState: any, _state: any) {
  return true
}

/**
 * @public
 */
export function defaultActionFilter(_action: Parameters<ActionSubscriber>['0']) {
  return true
}

/**
 * @public
 */
export function defaultTransformer(state: any) {
  return state
}

/**
 * @public
 */
export function defaultMutationTransformer(mutation: Parameters<Subscriber>['0']) {
  return mutation
}

/**
 * @public
 */
export function defaultActionTransformer(action: Parameters<ActionSubscriber>['0']) {
  return action
}

/**
 * @public
 */
export const defaultLogger = console

/**
 * @public
 */
export type RequiredOptions = {
  collapsed: boolean // auto-expand logged mutations
  filter: typeof defaultFilter // returns `true` if a mutation should be logged
  actionFilter: typeof defaultActionFilter // returns `true` if a action should be logged
  transformer: typeof defaultTransformer // transform the state before logging it.
  mutationTransformer: typeof defaultMutationTransformer // mutations are logged in the format of `{ type, payload }`
  actionTransformer: typeof defaultActionTransformer // actions are logged in the format of `{ type, payload }`
  logMutations: boolean
  logActions: boolean
  logger: typeof defaultLogger // implementation of the `console` API, default `console`
}

/**
 * @public
 */
export type Options = Partial<RequiredOptions>

function normalize(options: Options): RequiredOptions {
  return {
    collapsed: options.collapsed !== undefined ? options.collapsed : defaultCollapsed,
    filter: options.filter || defaultFilter,
    actionFilter: options.actionFilter || defaultActionFilter,
    transformer: options.transformer || defaultTransformer,
    mutationTransformer: options.mutationTransformer || defaultMutationTransformer,
    actionTransformer: options.actionTransformer || defaultActionTransformer,
    logMutations: options.logMutations !== undefined ? options.logMutations : true,
    logActions: options.logActions !== undefined ? options.logActions : true,
    logger: options.logger || defaultLogger,
  }
}

/**
 * @public
 */
export function createLoggerPlugin(options?: Options) {
  const {
    collapsed,
    filter,
    actionFilter,
    transformer,
    mutationTransformer,
    actionTransformer,
    logMutations,
    logActions,
    logger,
  } = normalize(options || {})

  return function <Store extends CreateStoreReturnType<any, any, any, any>>(store: Store) {
    let prevState = clone(store.state)

    if (logMutations) {
      store.subscribe(mutation => {
        const state = clone(store.state)

        if (filter(mutation, prevState, state)) {
          const formattedTime = getFormattedTime()
          const formattedMutation = mutationTransformer(mutation)
          const message = `mutation ${mutation.key}${formattedTime}`

          startMessage(logger, message, collapsed)
          logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState))
          logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation)
          logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(state))
          endMessage(logger)
        }

        prevState = state
      })
    }

    if (logActions) {
      store.actionSubscribe(action => {
        if (actionFilter(action) === false) return

        const formattedTime = getFormattedTime()
        const formattedAction = actionTransformer(action)
        const message = `action ${action.key}${formattedTime}`

        startMessage(logger, message, collapsed)
        logger.log('%c action', 'color: #03A9F4; font-weight: bold', formattedAction)
        endMessage(logger)
      })
    }
  }
}

function startMessage(logger: typeof defaultLogger, message: string, collapsed: typeof defaultCollapsed) {
  const startMessage = collapsed ? logger.groupCollapsed : logger.group

  try {
    startMessage.call(logger, message)
  } catch (e) {
    logger.log(message)
  }
}

function endMessage(logger: typeof defaultLogger) {
  try {
    logger.groupEnd()
  } catch (e) {
    logger.log('—— log end ——')
  }
}

function getFormattedTime() {
  const time = new Date()
  return ` @ ${time.getHours().toString().padStart(2, '0')}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${time
    .getMilliseconds()
    .toString()
    .padStart(2, '0')}`
}
