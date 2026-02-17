-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('RENT', 'BUY');

-- CreateEnum
CREATE TYPE "QualityType" AS ENUM ('HD', 'ULTRA_HD');

-- CreateTable
CREATE TABLE "tbl_movie_prices" (
    "id" SERIAL NOT NULL,
    "movie_id" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "quality" "QualityType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tbl_movie_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_movie_prices_movie_id_transaction_type_quality_key" ON "tbl_movie_prices"("movie_id", "transaction_type", "quality");

-- AddForeignKey
ALTER TABLE "tbl_movie_prices" ADD CONSTRAINT "tbl_movie_prices_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "tbl_movie"("imdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
