import { NextRequest, NextResponse } from 'next/server';
import { createArticleSchema } from '@/utils/validationSchemas';
import { CreateArticleDto } from '@/utils/dtos';
import { Article } from '@prisma/client';
import prisma from '@/utils/db';
import { ARTICLES_BY_PAGE } from '@/utils/constants';
import { verifyToken } from '@/utils/verifyToken';

/**
 *  @method  GET
 *  @route   ~/api/articles
 *  @desc    Get Articles By PageNumber
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = request.nextUrl.searchParams.get('pageNumber') || '1';

    const articles = await prisma.article.findMany({
      skip: ARTICLES_BY_PAGE * (parseInt(pageNumber) - 1),
      take: ARTICLES_BY_PAGE,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    );
  }
}

/**
 *  @method  POST
 *  @route   ~/api/articles
 *  @desc    Create New Article
 *  @access  private (Only Admin)
 */
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (user == null || user.isAdmin === false) {
      return NextResponse.json(
        { message: 'only admin, access denied' },
        { status: 403 }
      );
    }
    const body = (await request.json()) as CreateArticleDto;

    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    );
  }
}
