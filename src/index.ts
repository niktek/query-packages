import { fetchPaginate } from 'fetch-paginate';
import { fetchPaginateIterator } from 'fetch-paginate';

//https://registry.npmjs.org/-/v1/search?text=svelte&from=6400
async function  doit(){
	const deps = await fetch(
		'https://registry.npmjs.org/-/v1/search?text=skeletonlabs'
	);
	console.dir(deps)
}

doit()