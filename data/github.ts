import type { StargazersResponse, Repository } from '.';

async function getRepositoryStargazers(
	repoName: string,
	owner: string
): Promise<StargazersResponse> {
	const url = 'https://api.github.com/graphql';
	const token =
		'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';
	const query = `
query ($repoName: String!, $owner: String!, $cursor: String) {
	repository(name: $repoName, owner: $owner) {
		stargazers(first: 100, after: $cursor) {
			totalCount
				pageInfo {
					endCursor
					hasNextPage
				}
			edges {
				starredAt
					node {
						login
					}
				}
			}
		}
	}
`;
	let hasNextPage = true;
	let endCursor = null;
	let stargazers: StargazersResponse = {
		totalCount: 0,
		pageInfo: { endCursor: '', hasNextPage: false },
		edges: [],
	};

	while (hasNextPage) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				query: query,
				variables: {
					repoName: repoName,
					owner: owner,
					cursor: endCursor,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const newStargazers = data.data.repository.stargazers;
		stargazers.totalCount = newStargazers.totalCount;
		stargazers.pageInfo = newStargazers.pageInfo;
		stargazers.edges.push(...newStargazers.edges);
		hasNextPage = newStargazers.pageInfo.hasNextPage;
		endCursor = newStargazers.pageInfo.endCursor;

		await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before making the next request
	}

	return stargazers;
}

async function main() {
	const repoName = 'skeleton';
	const owner = 'skeletonlabs';
	const stargazersResponse = await getRepositoryStargazers(repoName, owner);

	const stargazersWithStarredAt = stargazersResponse.edges.map((edge) => {
		return { login: edge.node.login, starredAt: edge.starredAt };
	});
	const repo: Repository = {
		name: `${owner}/${repoName}`,
		stargazers: stargazersWithStarredAt,
	};

	console.log(repo);
}

main().catch((error) => console.error(error));

const geninfo = `{
	repository(owner: "skeletonlabs", name: "skeleton", followRenames: true) {
		name
		description
		createdAt
		updatedAt
		isArchived
		isLocked
		isTemplate
		licenseInfo {
			name
		}
		forkCount
		homepageUrl
		issues {
			totalCount
		}
		stargazers {
			totalCount
		}
		watchers {
			totalCount
		}
		pullRequests {
			totalCount
		}
	}
}`;
