import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { CreateMovieDTO, MovieResponseDTO, UpdateMovieDTO } from '@movies/infrastructure/dtos/movie.dto';
import { MovieService } from '@movies/application/services/movie.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiMovieNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiUUIDParam,
} from '@common/decorators/api-responses.decorators';

@Controller()
@ApiTags('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Post('/movie')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new movie' })
	@ApiCreatedResponse({
		type: MovieResponseDTO,
		description: 'The movie has been successfully created.',
	})
	@ApiBadRequestResponse()
	@ApiInternalServerErrorResponse()
	async createMovie(@Body() inputMovie: CreateMovieDTO): Promise<MovieResponseDTO> {
		return this.movieService.createMovie(inputMovie);
	}

	@Get('/movie/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a movie by id' })
	@ApiUUIDParam()
	@ApiOkResponse({
		type: MovieResponseDTO,
		description: 'The movie has been successfully retrieved.',
	})
	@ApiUnauthorizedResponse()
	@ApiMovieNotFoundResponse()
	@ApiInternalServerErrorResponse()
	async getMovieById(@Param('id', ParseUUIDPipe) id: string): Promise<MovieResponseDTO> {
		const movie = await this.movieService.getById(id);

		if (!movie) throw new NotFoundException();

		return movie;
	}

	@Patch('/movie/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a movie by id' })
	@ApiUUIDParam()
	@ApiOkResponse({
		type: MovieResponseDTO,
		description: 'The movie has been successfully updated.',
	})
	@ApiBadRequestResponse()
	@ApiUnauthorizedResponse()
	@ApiMovieNotFoundResponse()
	@ApiInternalServerErrorResponse()
	async updateMovie(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() inputMovie: UpdateMovieDTO,
	): Promise<MovieResponseDTO> {
		return this.movieService.update(id, inputMovie);
	}

	@Delete('/movie/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a movie by id' })
	@ApiUUIDParam()
	@ApiOkResponse({
		description: 'The movie has been successfully deleted.',
	})
	@ApiUnauthorizedResponse()
	@ApiMovieNotFoundResponse()
	@ApiInternalServerErrorResponse()
	async deleteMovie(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.movieService.delete(id);
	}

	@Get('/movies')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'List all movies' })
	@ApiOkResponse({
		type: [MovieResponseDTO],
		description: 'The movies have been successfully retrieved.',
	})
	@ApiInternalServerErrorResponse()
	async listMovies(): Promise<MovieResponseDTO[]> {
		return this.movieService.list();
	}
}
