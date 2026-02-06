/*
  Warnings:

  - Added the required column `last_name` to the `tbl_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tbl_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_user" ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
