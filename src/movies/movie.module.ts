import { Module } from '@nestjs/common';
import { MovieController } from '@movies/infrastructure/controllers/movie.controller';
import { MovieService } from '@movies/application/services/movie.service';
import { MoviePrismaRepository } from './infrastructure/repositories/movie-prisma.repository';
import { PrismaModule } from '@prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SyncMoviesCron } from './application/crons/syncMovies.cron';

@Module({
	imports: [PrismaModule, ScheduleModule.forRoot(), HttpModule],
	controllers: [MovieController],
	providers: [MovieService, { provide: 'MovieRepository', useClass: MoviePrismaRepository }, SyncMoviesCron],
})
export class MovieModule {}
