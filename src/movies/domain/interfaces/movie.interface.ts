import { Movie } from '@movies/domain/entities/movie.entity';

export type OptionalMovie = Partial<Movie>;

export type NewMovie = Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface UpdateMovieProps {
	title?: string;
	episodeId?: number;
	director?: string;
	producer?: string;
	releaseDate?: string;
	url?: string;
}

export interface UpdateMovieRepository extends UpdateMovieProps {
	updatedAt?: string;
	deletedAt?: string;
}
