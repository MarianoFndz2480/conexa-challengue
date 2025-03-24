import { Movie } from '@movies/domain/entities/movie.entity';
import { NewMovie } from '../../domain/interfaces/movie.interface';

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

export const newMoviesMockData: NewMovie[] = [
	{
		title: 'A New Hope',
		episodeId: 4,
		openingCrawl: 'Test crawl',
		director: 'George Lucas',
		producer: 'Gary Kurtz',
		releaseDate: '1977-05-25',
		url: 'https://swapi.dev/api/films/1/',
	},
	{
		title: 'Empire Strikes Back',
		episodeId: 5,
		openingCrawl: 'Test crawl 2',
		director: 'Irvin Kershner',
		producer: 'Gary Kurtz',
		releaseDate: '1980-05-17',
		url: 'https://swapi.dev/api/films/2/',
	},
];
