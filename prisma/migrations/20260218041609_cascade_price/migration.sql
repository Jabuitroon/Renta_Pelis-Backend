-- DropForeignKey
ALTER TABLE "tbl_movie_prices" DROP CONSTRAINT "tbl_movie_prices_movie_id_fkey";

-- AddForeignKey
ALTER TABLE "tbl_movie_prices" ADD CONSTRAINT "tbl_movie_prices_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "tbl_movie"("imdb_id") ON DELETE CASCADE ON UPDATE CASCADE;
