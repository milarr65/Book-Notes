import axios from "axios";
import { marked } from "marked"; //converts markdown to html

const base_url = "https://openlibrary.org";
const search_url = "https://openlibrary.org/search.json";
const covers_url = "https://covers.openlibrary.org/b"; /* add /id/<key>-L.jpg */

export async function searchBooks(query) {
	try {
		const result = await axios.get(search_url, {
			params: {
				q: query,
				fields:
					"author_name,cover_i,title,subtitle,first_sentence,key,first_publish_year,ratings_count,edition_count,language",
				language: "eng",
				mode: "everything",
				page: 1,
			},
		});

		// access data from result
		const found_books = result.data.docs;

		// Map obtained info into the desired format
		const data = found_books.map((book) => ({
			title: book.title,
			year: book.first_publish_year,
			author: book.author_name ? book.author_name.join(", ") : "Unknown",
			cover_id: book.cover_i || null,
			cover_url: book.cover_i ? `${covers_url}/id/${book.cover_i}-L.jpg` : null,
			key: book.key, // Unique Open Library book key eg: works/OL12345
			olid: book.key.substring(7),
		}));

		return data;
	} catch (error) {
		throw new Error("SearchBooks error: " + error.message || error);
	}
}

export async function getBook(key) {
	// this has to be /works/OL123M
	try {
		const response = await axios.get(base_url + key + ".json");
		const data = response.data;
		const authorKey = data.authors[0].author.key;
		let description = "";

		if (data.description) {
			description = // Access book description depending on the format it comes as
				typeof data.description === "object"
					? data.description.value
					: data.description;
		}
		const [ratings, author, year, desc] = await Promise.all([
			getBookRatings(data.key),
			getAuthorName(authorKey),
			getFirstPublishYear(data.title),
			marked(description),
		]);

		const book = {
			title: data.title,
			ratings,
			cover_url: `${covers_url}/id/${data.covers[0]}-L.jpg`,
			cover_id: data.covers[0],
			olid: key.split("/")[2],
			author,
			year,
			description: desc,
		};

		return book;
	} catch (error) {
		throw error;
	}
}

async function getFirstPublishYear(title) {
	try {
		const response = await axios.get(search_url, {
			params: { title: title },
		});

		if (response.status !== 200) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			);
		}

		const docs = response.data.docs;
		if (!docs || docs.length === 0) {
			throw new Error(`No results found for title: "${title}"`);
		}

		return docs[0].first_publish_year ?? null;
	} catch (error) {
		throw error;
	}
}

export async function getAuthorName(authorKey) {
	try {
		const response = await axios.get(`${base_url}${authorKey}.json`);
		return response.data.name ?? "Unknown";
	} catch (error) {
		throw error;
	}
}

export async function getBookRatings(key) {
	try {
		const response = await axios.get(`${base_url}${key}/ratings.json`);
		const data = response.data.summary;
		let average = 0;
		const count = data.count || 0;
		if (data && data.average != null && !isNaN(data.average)) {
			average = parseFloat(data.average.toFixed(1)) || 0; // round ratings to 1 decimal
		}
		
		return { count, average };
	} catch (error) {
		throw error;
	}
}
