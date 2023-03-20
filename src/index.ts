import { fetchPaginate } from 'fetch-paginate';
import { fetchPaginateIterator } from 'fetch-paginate';
global.fetch = require('node-fetch');

//https://registry.npmjs.org/-/v1/search?text=svelte&from=6400
async function  doit(){
	const myIterator = fetchPaginateIterator(
		'https://registry.npmjs.org/-/v1/search?text=skeletonlabs'
	);

	for await (const { pageItems } of myIterator) {
		console.log(pageItems);
	}
}

doit()