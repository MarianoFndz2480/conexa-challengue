import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreateMovieDTO {
	@ApiProperty({ example: 'The Empire Strikes Back' })
	@IsString()
	title: string;

	@ApiProperty({ example: 5 })
	@IsNumber()
	episodeId: number;

	@ApiProperty({ example: 'The Empire Strikes Back' })
	@IsString()
	openingCrawl: string;

	@ApiProperty({ example: 'George Lucas' })
	@IsString()
	director: string;

	@ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
	@IsString()
	producer: string;

	@ApiProperty({ example: '1980-05-17' })
	@IsDateString()
	releaseDate: string;

	@ApiProperty({ example: 'https://swapi.dev/api/films/2/' })
	@IsString()
	url: string;
}

export class MovieResponseDTO extends CreateMovieDTO {
	@ApiProperty({ example: '2978a530-1d00-4861-9858-10dd1ab32e7e' })
	@IsUUID()
	id: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
	@IsDateString()
	createdAt: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
	@IsDateString()
	updatedAt: string;
}

export class UpdateMovieDTO extends PartialType(
	OmitType(MovieResponseDTO, ['id', 'createdAt', 'updatedAt'] as const),
) {}
