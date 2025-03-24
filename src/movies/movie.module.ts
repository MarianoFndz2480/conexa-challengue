import { Module } from '@nestjs/common';
import { MovieController } from '@movies/infrastructure/controllers/movie.controller';
import { MovieService } from '@movies/application/services/movie.service';
import { MovieMockRepository } from '@movies/infrastructure/repositories/movie-mock.repository';

@Module({
	imports: [],
	controllers: [MovieController],
	providers: [MovieService, { provide: 'MovieRepository', useClass: MovieMockRepository }],
})
export class MovieModule {}
