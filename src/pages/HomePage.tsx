import React from "react";
import BookList from "../components/Home/BookList";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../firebase";

const HomePage = () => {
  return <BookList />;
};

export default HomePage;

export interface book {
  author: string;
  country: string;
  imageLink: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
  id: number;
  liked: boolean;
}

export const loader = async () => {
  const db = getDatabase(app);
  const dbRef = ref(db, `/books`);
  let booksData: book[] = [];
  await get(dbRef).then((snapshot) => {
    booksData = snapshot.val();
  });
  return booksData;
};
