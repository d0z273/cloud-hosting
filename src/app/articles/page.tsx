import { getArticles } from '@/apiCalls/articleApiCall';
import ArticleItem from '@/components/articles/ArticleItem';
import Pagination from '@/components/articles/Pagination';
import SearchArticleInput from '@/components/articles/SearchArticleInput';
import { ARTICLES_BY_PAGE } from '@/utils/constants';
import { Article } from '@prisma/client';
import { Metadata } from 'next';
import prisma from '@/utils/db';

interface ArticlesPageProps {
  searchParams: { pageNumber: string };
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const { pageNumber } = searchParams;

  const articles: Article[] = await getArticles(pageNumber);
  const count: number = await prisma.article.count();

  const pages = Math.ceil(count / ARTICLES_BY_PAGE);

  return (
    <section className="container m-auto px-5">
      <SearchArticleInput />
      <div className="flex items-center justify-center flex-wrap gap-7">
        {articles.slice(0, 6).map((item) => (
          <ArticleItem article={item} key={item.id} />
        ))}
      </div>
      <Pagination
        pageNumber={parseInt(pageNumber)}
        route="/articles"
        pages={pages}
      />
    </section>
  );
};

export default ArticlesPage;

export const metadata: Metadata = {
  title: 'Articles Page',
  description: 'Articles about programming',
};
