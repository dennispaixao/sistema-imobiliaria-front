import { apiSlice } from "../../app/api/apiSlice";

export const imagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        key: "images",
        body: formData,
      }),
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),
    deleteImage: builder.mutation({
      query: (imageUrls) => ({
        url: "/upload",
        method: "DELETE",

        body: { imageUrls },
      }),
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),
  }),
});

export const { useAddNewImageMutation, useDeleteImageMutation } =
  imagesApiSlice;
