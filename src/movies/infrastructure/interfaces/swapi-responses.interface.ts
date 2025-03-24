export interface SWAPIResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: SWAPIMovie[];
}

export interface SWAPIMovie {
	title: string;
	episode_id: number;
	opening_crawl: string;
	director: string;
	producer: string;
	release_date: string;
	url: string;
}
