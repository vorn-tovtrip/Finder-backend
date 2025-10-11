export type BookIdParams = {
  id: string;
};

export type UpdateBookParams = Partial<{
  bookName: string | null;
  code: string | null;
  label: string | null;
  country: string | null;
}>;
