import supabase from "../supabase/supabaseClient.js";

export async function getAllBooks(orderBy) {
	let { data, error } = await supabase
		.from("books")
		.select("*")
		.order(...orderBy);

	if (error)
		throw new Error(error.message || "Failed to fetch books from databse");

	return data;
}

export async function getBookById(id) {
	let { data, error } = await supabase.from("books").select("*").eq("id", id);

	if (error) {
		throw new Error(error.message || "Book not found in database");
	}
	return data[0];
}

export async function createBook(book) {
	let { error } = await supabase.from("books").insert({
		title: book.title,
		author: book.author,
		cover_id: book.cover_id,
		cover_url: book.cover_url,
		user_rating: book.user_rating,
		review: book.review,
		olid: book.olid,
		description: book.description,
		year: book.year,
	});

	if (error) {
		throw new Error(error.message || "Failed to create book");
	}

	return { success: true };
}

export async function updateBook(bookId, data) {
	let { error } = await supabase
		.from("books")
		.update({ 
			user_rating: data.user_rating, 
			review: data.review })
		.eq("id", bookId);

	if (error) throw new Error(error.message || "Failed to update book");

	return { success: true };
}

export async function deleteBook(bookId) {
	let { error } = await supabase.from("books").delete().eq("id", bookId);

	if (error) throw new Error(error.message || "Failed to delete book");

	return { success: true };
}
