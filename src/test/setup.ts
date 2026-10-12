import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('zustand', () => ({
  create: <T>(fn: (set: (state: T) => void) => T) => fn((state: T) => state),
}));