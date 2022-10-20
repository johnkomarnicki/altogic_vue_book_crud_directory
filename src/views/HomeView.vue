<script setup>
import { ref } from "vue";
import altogic from "../altogic/altogic";

const bookData = ref();

// Get Books
const getBooks = async () => {
  const { data, error } = await altogic.db.model("book").get();
  if (!error) {
    bookData.value = data;
    // Add For Detecting Updates
    bookData.value.forEach((book) => (book.isEditing = null));
  }
};

// Create Book
const createLocalBook = () => {
  bookData.value.push({
    _id: Math.floor(Math.random() * 100),
    title: "",
    author: "",
    isEditing: true,
    isLocal: true,
  });
};

const createDataBaseBook = async (book, index) => {
  const { data, error } = await altogic.db.model("book").object().create({
    title: book.title,
    author: book.author,
  });

  // If no Error, add book to list
  if (!error) {
    bookData.value[index] = {
      ...data,
      isEditing: null,
    };
  }
};

const toggleBookEditing = (index) => {
  bookData.value[index].isEditing = true;
};

const updateBook = async (book, index) => {
  const { data, error } = await altogic.db.model("book").object(book._id).update({
    title: book.title,
    author: book.author,
  });

  // If no Error, add book to list
  if (!error) {
    bookData.value[index] = {
      ...data,
      isEditing: null,
    };
  }
};

const deleteBook = async (book) => {
  if (!book.isLocal) {
    // Remove From Data Base
    await altogic.db.model("book").object(book._id).delete();
  }

  // Remove Locally
  bookData.value = bookData.value.filter(
    (bookFilter) => bookFilter._id !== book._id
  );
};

await getBooks();
</script>

<template>
  <main class="h-screen bg-slate-500">
    <div class="container max-w-screen-lg mx-auto py-8 px-4 flex flex-col">
      <h1 class="text-white text-4xl mb-4">Altogic Book Directory</h1>
      <ul class="grid gap-8 grid-cols-4">
        <div
          v-for="(book, index) in bookData"
          class="bg-slate-100 p-4 rounded-md flex flex-col shadow-lg"
        >
          <div v-if="book.isEditing">
            <label>Title:</label>
            <input type="text" v-model="book.title" class="mb-2 p-1 shadow-md" />
            <label>Author:</label>
            <input type="text" v-model="book.author" class="mb-4 p-1 shadow-md" />
          </div>
          <div v-else>
            <p class="text-lg mb-2">{{ book.title }}</p>
            <p class="text-sm mb-4"><span>By:</span>{{ book.author }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-if="book.isLocal"
              @click="createDataBaseBook(book, index)"
              class="self-start text-sm bg-slate-600 text-white py-1 px-4 rounded-md"
            >
              Create
            </button>
            <button
              v-else-if="book.isEditing"
              @click="updateBook(book, index)"
              class="self-start text-sm bg-slate-600 text-white py-1 px-4 rounded-md"
            >
              Update
            </button>
            <button
              v-else
              @click="toggleBookEditing(index)"
              class="self-start text-sm bg-slate-600 text-white py-1 px-4 rounded-md"
            >
              Edit
            </button>
            <button
              @click="deleteBook(book)"
              class="self-start text-sm bg-red-600 text-white py-1 px-4 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </ul>
      <div
        @click="createLocalBook"
        class="px-4 py-2 rounded-md border-slate-100 border-dashed border-2 flex items-center justify-center text-white cursor-pointer self-start mt-8 hover:border-slate-900 hover:shadow-lg duration-150"
      >
        <p>Create New Book</p>
      </div>
    </div>
  </main>
</template>
