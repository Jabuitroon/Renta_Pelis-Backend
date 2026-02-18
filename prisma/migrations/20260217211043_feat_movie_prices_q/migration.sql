/*
  Warnings:

  - Changed the type of `quality` on the `tbl_movie_prices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tbl_movie_prices" DROP COLUMN "quality",
ADD COLUMN     "quality" "QualityOption" NOT NULL;

-- DropEnum
DROP TYPE "QualityType";

-- DropEnum
DROP TYPE "RentState";

-- CreateIndex
CREATE UNIQUE INDEX "tbl_movie_prices_movie_id_transaction_type_quality_key" ON "tbl_movie_prices"("movie_id", "transaction_type", "quality");
