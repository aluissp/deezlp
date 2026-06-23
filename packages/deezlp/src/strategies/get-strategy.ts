import { StrategyNotFoundException } from '@/exceptions';
import type { ResourceStrategy } from './resource.strategy';
import { TrackStrategy } from './track.strategy';

const strategies: Record<string, ResourceStrategy> = {
	track: new TrackStrategy(),
};

export const getStrategy = (type: string): ResourceStrategy => {
	const strategy = strategies[type];

	if (!strategy) throw new StrategyNotFoundException(`Strategy for type "${type}" not found!`);

	return strategy;
};
