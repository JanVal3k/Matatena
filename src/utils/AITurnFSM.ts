export type AIState =
  | 'idle'
  | 'rolling'
  | 'ready'
  | 'dropping'
  | 'completed';

export type AIEvent =
  | 'start'
  | 'diceComplete'
  | 'proceed'
  | 'dropComplete'
  | 'reset';

export interface AITransition {
  from: AIState;
  event: AIEvent;
  to: AIState;
}

export const AI_TRANSITIONS: Record<AIState, Partial<Record<AIEvent, AIState>>> = {
  idle: {
    start: 'rolling',
  },
  rolling: {
    diceComplete: 'ready',
  },
  ready: {
    proceed: 'dropping',
  },
  dropping: {
    dropComplete: 'completed',
  },
  completed: {
    reset: 'idle',
  },
};

export function runFSM(currentState: AIState, event: AIEvent): AIState {
  const transition = AI_TRANSITIONS[currentState]?.[event];
  return transition ?? currentState;
}

export function canPerformAction(state: AIState, action: 'roll' | 'drop' | 'restart'): boolean {
  switch (state) {
    case 'idle':
      return action === 'roll';
    case 'rolling':
      return action === 'roll';
    case 'ready':
      return action === 'drop';
    case 'dropping':
      return false;
    case 'completed':
      return action === 'restart';
    default:
      return false;
  }
}