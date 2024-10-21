import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const categoriesAdapter = createEntityAdapter({});

const initialState = categoriesAdapter.getInitialState();

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCategories = responseData.map((categorie) => {
          categorie.id = categorie._id;
          return categorie;
        });
        return categoriesAdapter.setAll(initialState, loadedCategories);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Categorie", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Categorie", id })),
          ];
        } else return [{ type: "Categorie", id: "LIST" }];
      },
    }),
    addNewCategorie: builder.mutation({
      query: (initialCategorieData) => ({
        url: "/categories",
        method: "POST",
        body: {
          ...initialCategorieData,
        },
      }),
      invalidatesTags: [{ type: "Categorie", id: "LIST" }],
    }),
    updateCategorie: builder.mutation({
      query: (initialCategorieData) => ({
        url: "/categories",
        method: "PATCH",
        body: {
          ...initialCategorieData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Categorie", id: arg.id },
      ],
    }),
    deleteCategorie: builder.mutation({
      query: ({ id }) => ({
        url: `/categories`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Categorie", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddNewCategorieMutation,
  useUpdateCategorieMutation,
  useDeleteCategorieMutation,
} = categoriesApiSlice;

// returns the query result object
export const selectCategoriesResult =
  categoriesApiSlice.endpoints.getCategories.select();

// creates memoized selector
const selectCategoriesData = createSelector(
  selectCategoriesResult,
  (categoriesResult) => categoriesResult.data // normalized state object with ids & entities
);
export const selectCategoriesByIds = createSelector(
  // Primeiro argumento: retorna o estado normalizado de categorias
  (state) => selectCategoriesData(state),
  // Segundo argumento: recebe os ids como argumento
  (state, ids) => ids,
  // Função de resultado: verifica se o estado de categorias e entities estão definidos e se ids é um array
  (categories, ids) => {
    if (!categories || !categories.entities || !Array.isArray(ids)) {
      return []; // Retorna um array vazio se o estado ou ids forem indefinidos/inválidos
    }
    return ids.map((id) => categories.entities[id]).filter(Boolean);
  }
);
//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCategories,
  selectById: selectCategorieById,
  selectIds: selectCategorieIds,
  // Pass in a selector that returns the categories slice of state
} = categoriesAdapter.getSelectors(
  (state) => selectCategoriesData(state) ?? initialState
);
