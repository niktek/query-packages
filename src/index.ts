import { fetchPaginate } from 'fetch-paginate';

//https://registry.npmjs.org/-/v1/search?text=svelte&from=6400
async function  doit(){
	const { items } = await fetchPaginate(
		'https://registry.npmjs.org/-/v1/search?text=skeletonlabs'
	);
	console.log(items);
}

doit()