import type { URLType } from '@/resolvers';
import { AlbumStrategy } from './album.strategy';
import { TrackStrategy } from './track.strategy';
import { StrategyNotFoundException } from '@/exceptions';
import type { ResourceStrategy } from './resource.strategy';

const strategies: Record<string, ResourceStrategy> = {
	track: new TrackStrategy(),
	album: new AlbumStrategy(),
};

export const getStrategy = (type: URLType): ResourceStrategy => {
	const strategy = strategies[type];

	if (!strategy) throw new StrategyNotFoundException(`Strategy for type "${type}" not found!`);

	return strategy;
};
