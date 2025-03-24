import { CreateMovieDTO, UpdateMovieDTO } from '@movies/infrastructure/dtos/movie.dto';
import { Movie } from '@movies/domain/entities/movie.entity';
import { movieMockData } from '@movies/infrastructure/mock-data/movie.mock-data';
import { MovieRepository } from '@movies/domain/repositories/movie.repository';

const arrayMockData = [movieMockData];

export class MovieMockRepository implements MovieRepository {
	create(inputMovie: CreateMovieDTO): Promise<Movie> {
		return Promise.resolve({
			...movieMockData,
			...inputMovie,
		});
	}

	getBy(props: Partial<Movie>): Promise<Movie | null> {
		return Promise.resolve(
			arrayMockData.find((movie) => {
				return Object.keys(props).every((key) => {
					if (props[key] === undefined || props[key] === null) {
						return true;
					}
					return movie[key] === props[key];
				});
			}) || null,
		);
	}

	update(id: string, inputMovie: UpdateMovieDTO): Promise<Movie | null> {
		const movie = arrayMockData.find((movie) => movie.id === id);

		if (!movie) return Promise.resolve(null);

		return Promise.resolve({ ...movie, ...inputMovie });
	}

	delete(id: string): Promise<void> {
		const movie = arrayMockData.find((movie) => movie.id === id);

		if (!movie) return Promise.resolve(null);

		return Promise.resolve();
	}

	list(): Promise<Movie[]> {
		return Promise.resolve(arrayMockData);
	}
}
