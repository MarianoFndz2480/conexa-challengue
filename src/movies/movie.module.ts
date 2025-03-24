import { Module } from '@nestjs/common';
import { MovieController } from '@movies/infrastructure/controllers/movie.controller';
import { MovieService } from '@movies/application/services/movie.service';
import { MoviePrismaRepository } from './infrastructure/repositories/movie-prisma.repository';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [MovieController],
	providers: [MovieService, { provide: 'MovieRepository', useClass: MoviePrismaRepository }],
})
export class MovieModule {}
