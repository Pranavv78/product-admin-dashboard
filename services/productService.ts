

import api from "@/lib/axios";

export const getProducts = async (
  limit: number,
  skip: number,
  search: string,
  category: string,
  sort: string,
  signal?: AbortSignal
) => {
  let url = `/products?limit=${limit}&skip=${skip}`;

 if (category.trim()) {
  url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
} else if (search.trim()) {
  url = `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
}

if (sort) {
  const [sortBy, order] = sort.split("-");

  url += `&sortBy=${sortBy}&order=${order}`;
}

  const response = await api.get(url, {
  signal,
});

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const addProduct = async (product: {
  title: string;
  price: number;
  description: string;
}) => {
  const response = await api.post("/products/add", product);

  return response.data;
};


export const updateProduct = async (
  id: string,
  product: {
    title: string;
    price: number;
    description: string;
  }
) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};


export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};


