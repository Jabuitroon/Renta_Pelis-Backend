/*
  Warnings:

  - The values [Acción_y_Aventuras] on the enum `GenreType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GenreType_new" AS ENUM ('Anime', 'Drama', 'Documental', 'Fantasia', 'Romance', 'Comedia', 'Horror', 'Ninos', 'Ciencia_ficcion', 'Misterio', 'Thriller');
ALTER TABLE "tbl_movie_genre" ALTER COLUMN "genre" TYPE "GenreType_new" USING ("genre"::text::"GenreType_new");
ALTER TYPE "GenreType" RENAME TO "GenreType_old";
ALTER TYPE "GenreType_new" RENAME TO "GenreType";
DROP TYPE "public"."GenreType_old";
COMMIT;
