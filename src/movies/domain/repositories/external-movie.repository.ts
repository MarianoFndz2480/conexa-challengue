import { NewMovie } from '@movies/domain/interfaces/movie.interface';

export interface ExternalMovieRepository {
	getMovies(): Promise<NewMovie[]>;
}
