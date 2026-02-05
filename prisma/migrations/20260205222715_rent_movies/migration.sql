-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'cliente');

-- CreateEnum
CREATE TYPE "GenreType" AS ENUM ('Acción_y_Aventuras', 'Anime', 'Drama', 'Documental', 'Fantasia', 'Romance', 'Comedia', 'Horror', 'Ninos', 'Ciencia_ficcion', 'Misterio', 'Thriller');

-- CreateEnum
CREATE TYPE "QualityOption" AS ENUM ('p720', 'p1080', 'p4k');

-- CreateEnum
CREATE TYPE "RentState" AS ENUM ('available', 'reserved', 'unavailable');

-- CreateTable
CREATE TABLE "tbl_user" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'cliente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tbl_movie" (
    "imdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" TEXT,
    "type" TEXT,
    "rated" TEXT,
    "released" TIMESTAMP(3),
    "runtime" TEXT,
    "plot" TEXT,
    "language" TEXT,
    "country" TEXT,
    "awards" TEXT,
    "poster" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_movie_pkey" PRIMARY KEY ("imdb_id")
);

-- CreateTable
CREATE TABLE "tbl_movie_genre" (
    "imdbId" TEXT NOT NULL,
    "genre" "GenreType" NOT NULL,

    CONSTRAINT "tbl_movie_genre_pkey" PRIMARY KEY ("imdbId","genre")
);

-- CreateTable
CREATE TABLE "tbl_favorite" (
    "user_id" TEXT NOT NULL,
    "imdb_id" TEXT NOT NULL,

    CONSTRAINT "tbl_favorite_pkey" PRIMARY KEY ("user_id","imdb_id")
);

-- CreateTable
CREATE TABLE "tbl_review" (
    "review_id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "user_id" TEXT NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_review_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_email_key" ON "tbl_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_review_user_id_imdb_id_key" ON "tbl_review"("user_id", "imdb_id");

-- AddForeignKey
ALTER TABLE "tbl_movie_genre" ADD CONSTRAINT "tbl_movie_genre_imdbId_fkey" FOREIGN KEY ("imdbId") REFERENCES "tbl_movie"("imdb_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_favorite" ADD CONSTRAINT "tbl_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_favorite" ADD CONSTRAINT "tbl_favorite_imdb_id_fkey" FOREIGN KEY ("imdb_id") REFERENCES "tbl_movie"("imdb_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_review" ADD CONSTRAINT "tbl_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_review" ADD CONSTRAINT "tbl_review_imdb_id_fkey" FOREIGN KEY ("imdb_id") REFERENCES "tbl_movie"("imdb_id") ON DELETE CASCADE ON UPDATE CASCADE;
