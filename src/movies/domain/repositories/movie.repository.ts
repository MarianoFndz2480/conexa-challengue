import { Movie } from '@movies/domain/entities/movie.entity';
import { NewMovie, OptionalMovie, UpdateMovieRepository } from '@movies/domain/interfaces/movie.interface';

export interface MovieRepository {
	create(inputMovie: NewMovie): Promise<Movie>;
	getBy(props: OptionalMovie): Promise<Movie | null>;
	update(id: string, inputMovie: UpdateMovieRepository): Promise<Movie>;
	list(): Promise<Movie[]>;
}
