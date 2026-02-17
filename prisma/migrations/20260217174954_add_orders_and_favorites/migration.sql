-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED', 'REFUNDED');

-- CreateTable
CREATE TABLE "tbl_order" (
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "tbl_order_item" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tbl_order_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tbl_order_user_id_idx" ON "tbl_order"("user_id");

-- AddForeignKey
ALTER TABLE "tbl_order" ADD CONSTRAINT "tbl_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_order_item" ADD CONSTRAINT "tbl_order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tbl_order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_order_item" ADD CONSTRAINT "tbl_order_item_imdb_id_fkey" FOREIGN KEY ("imdb_id") REFERENCES "tbl_movie"("imdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
