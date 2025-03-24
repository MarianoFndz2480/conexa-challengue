import { Movie } from '@movies/domain/entities/movie.entity';

export const movieMockData: Movie = {
	id: '2978a530-1d00-4861-9858-10dd1ab32e7e',
	episodeId: 5,
	title: 'The Empire Strikes Back',
	openingCrawl: 'The Empire Strikes Back',
	director: 'Irvin Kershner',
	producer: 'Gary Kurtz, Rick McCallum',
	releaseDate: '1980-05-17',
	url: 'https://swapi.dev/api/films/2/',
	createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
	updatedAt: null,
	deletedAt: null,
};
