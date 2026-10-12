import type { AIStrategy, AIConfig } from './types';
import { EasyStrategy } from './EasyStrategy';
import { MediumStrategy } from './MediumStrategy';
import { HardStrategy } from './HardStrategy';
import { AI_CONFIG } from '../../constants/Constants';

export class AIFactory {
  private static strategies: Map<string, AIStrategy> = new Map();

  static create(difficulty: 'easy' | 'medium' | 'hard'): AIStrategy {
    if (!this.strategies.has(difficulty)) {
      const config = AI_CONFIG[difficulty] as AIConfig;
      
      switch (difficulty) {
        case 'easy':
          this.strategies.set(difficulty, new EasyStrategy(config));
          break;
        case 'medium':
          this.strategies.set(difficulty, new MediumStrategy(config));
          break;
        case 'hard':
          this.strategies.set(difficulty, new HardStrategy(config));
          break;
      }
    }
    return this.strategies.get(difficulty)!;
  }

  static reset(): void {
    this.strategies.clear();
  }
}